import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
import { 
    acceptable,
    acceptWebSocket,
    isWebSocketCloseEvent,
    isWebSocketPingEvent,
    WebSocket
} from "https://deno.land/std/ws/mod.ts";
const hostname = '0.0.0.0';
const port = 8080;
const server = serve({ hostname: hostname, port: port });
const clients: Array<WebSocket> = new Array<WebSocket>();

function sendAll(message: string) {
    for(var i = 0; i < clients.length; i++) {
        clients[i].send(message);
    }
}

console.log(`MVV Server on ${port}`);

const decoder = new TextDecoder('utf-8');

async function handleWebSocket(request: ServerRequest) {
    const { conn, r: bufReader, w: bufWriter, headers } = request;

    try {
        const sock = await acceptWebSocket({
            conn,
            bufReader,
            bufWriter,
            headers,
        });
        console.log("WebSocket connected!");
        clients.push(sock); // save client
        try {
            for await (const ev of sock) {
                if (typeof ev === "string") {
                    // text message
                    console.log("ws:Text", ev);
                    sendAll(ev);
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

async function dispatch(request: ServerRequest) {
    switch(request.url) {
        case '/favicon.ico': 
            request.respond({status: 404});
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

for await (const req: ServerRequest of server) {
    // acceptable checks if a request has the websocket headers
    if(acceptable(req)) {
        handleWebSocket(req);
    } else {
        dispatch(req);
    }
}
