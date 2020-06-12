export class Channel {
    name: string;
    members: Array<ChannelMember>;
    constructor(name: string) {
        this.name = name;
        this.members = new Array<ChannelMember>();
    }
    memberCount(): number {
        return this.members.length;
    }
    join(memberName: string, socket: any) {
        let member = new ChannelMember(memberName, socket);
        this.members.push(member);
    }
    broadcast(message: string) {
        for(const member of this.members) {
            member.send(message);
        }
    }
}

export class ChannelMember {
    name: string;
    socket: any;
    constructor(name: string, socket: any) {
        this.name = name;
        this.socket = socket;
    }
    canReceiveMessages() {
        return !this.socket.isClosed;
    }
    send(message: string) {
        if(this.canReceiveMessages()) {
            this.socket.send(message);
        } else {
            console.log(`ChannelMember: ${this.name} cannot receive messages, their websocket is closeD`);
        }
    }
}