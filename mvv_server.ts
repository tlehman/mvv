import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
const port = 8000;
const server = serve({ port: port });

console.log(`MVV Server on ${port}`);

const decoder = new TextDecoder('utf-8');

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
            const html = decoder.decode(await Deno.readFile("index.html"));
            request.respond({body: html});
    }

}

for await (const req: ServerRequest of server) {
    dispatch(req);
}
