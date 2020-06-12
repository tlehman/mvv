import { Channel, ChannelMember } from './channel.ts';

class MockSocket {
   isClosed: boolean;
   sendCount: number;
   constructor() { this.isClosed = false; this.sendCount = 0; }
   send(message: string) { this.sendCount += 1; }
}

Deno.test("Add members to a Channel", () => {
    let channel = new Channel("coffee lovers");
    let sock1 = new MockSocket();
    let sock2 = new MockSocket();
    channel.join("Yonas", sock1);
    if(channel.memberCount() != 1) {
        throw Error("ChannelMember count should equal 1");
    }
    channel.join("Naru", sock2);
    if(channel.memberCount() != 2) {
        throw Error("ChannelMember count should equal 2");
    }
});

Deno.test("Broadcasts only to the ChannelMembers whose sockets are not closed", () => {
    let channel = new Channel("time travel chat");
    let sock1 = new MockSocket();
    let sock2 = new MockSocket();
    channel.join("Alice", sock1);
    channel.join("Bob", sock2);
    sock2.isClosed = true;
    channel.broadcast("Looper was better than Primer");
    if(!(sock1.sendCount == 1 && sock2.sendCount == 0)) {
        console.log(sock1.sendCount);
        console.log(sock2.sendCount);
        throw Error("broadcast should not send to closed socket");
    }
});