import { Channel, ChannelMember } from './channel.ts';
import {
    serve,
    Server,
    ServerRequest
} from "https://deno.land/std/http/server.ts";
import { 
    acceptable,
    acceptWebSocket,
    isWebSocketCloseEvent,
    isWebSocketPingEvent,
} from "https://deno.land/std/ws/mod.ts";

export class MVVServer {
    hostname: string;
    port: number;
    channels: Array<Channel>;
    server: Server;

    constructor(hostname: string, port: number) {
        this.hostname = hostname;
        this.port = port;
        this.server = serve({ hostname: this.hostname, port: this.port });
        this.channels = []; // TODO extract this from the URL
        console.log(`MVV Server on ${this.port}`);
    }

    async serve() {
        for await (const req of this.server) {
            let handler = (acceptable(req)) ? this.handleWs : this.handleHttp;
            handler(req)
        }
    }
    async handleHttp(request: ServerRequest) {
        const decoder = new TextDecoder("utf-8");
        switch(request.url) {
            case '/favicon.ico': 
                const favicon = await Deno.readFile("favicon.ico");
                request.respond({body: favicon});
                break;
            case '/webrtc.js': 
                const js = decoder.decode(await Deno.readFile("webrtc.js"));
                request.respond({body: js});
                break;
            default:
                const sessionId = request.url.split("/")[1];
                console.log(`Visited ${request.url}`);
                console.log({ body: `Session Id = ${sessionId}` });
                const htmlTemplate = decoder.decode(await Deno.readFile("index.html"));
                const html = htmlTemplate.replace("\{\{title\}\}", sessionId);
                request.respond({body: html});
        }
    }
    async handleWs(request: ServerRequest) {
        const { conn, r: bufReader, w: bufWriter, headers } = request;

        try {
            const sock = await acceptWebSocket({
                conn,
                bufReader,
                bufWriter,
                headers,
            });
            console.log("WebSocket connected!");
            try {
                for await (const ev of sock) {
                    if (typeof ev === "string") {
                        // text message
                        console.log("ws:Text", ev);
                        // Channel broadcast
                    } else if (ev instanceof Uint8Array) {
                        // binary message
                        console.log("ws:Binary", ev);
                    } else if (isWebSocketPingEvent(ev)) {
                        const [, body] = ev;
                        // ping
                        console.log("ws:Ping", body);
                    } else if (isWebSocketCloseEvent(ev)) {
                        // close
                        const { code, reason } = ev;
                        console.log("ws:Close", code, reason);
                    }
                }
            } catch (err) {
                console.error(`failed to receive frame: ${err}`);

                if (!sock.isClosed) {
                    await sock.close(1000).catch(console.error);
                }
            }
        } catch (err) {
            console.error(`failed to accept websocket: ${err}`);
            await request.respond({ status: 400 });
        }
    }
}