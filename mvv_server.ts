import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
const port = 8000;
const server = serve({ port: port });

console.log(`MVV Server on ${port}`);

const decoder = new TextDecoder('utf-8');

async function dispatch(request: ServerRequest) {
    switch(request.url) {
        case '/': 
        case '/index.html': 
            const html = decoder.decode(await Deno.readFile("index.html"));
            request.respond({body: html});
            break;
        case '/webrtc.js': 
            const js = decoder.decode(await Deno.readFile("webrtc.js"));
            request.respond({body: js});
            break;
        default:
            request.respond({status: 404});
    }

}

for await (const req: ServerRequest of server) {
    dispatch(req);
    //const sessionId = req.url.split("/")[1];
    //req.respond({ body: `Session Id = ${sessionId}` });
    //console.log(`Visited ${req.url}`);
}
