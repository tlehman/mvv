const openMediaDevices = async (constraints) => {
    return navigator.mediaDevices.getUserMedia(constraints);
}

async function playLocalVideo() {
    try {
        const stream = await openMediaDevices({ 'video': true, 'audio': true });
        console.log('Got MediaStream:', stream);
        const localVideo = document.querySelector("video#localVideo");
        localVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}


const wsurl = window.location.href.replace("http", "ws");
const webSocket = new WebSocket(wsurl);

webSocket.onmessage = function (ev) {
    const chatInput = document.getElementById("chat-input");
    const chatOutput = document.getElementById("chat-output");
    const message = document.createElement("li");
    const messageData = ev.data || chatInput.value;
    const date = (new Date()).toISOString();
    const textnode = document.createTextNode(date + ": " + messageData);
    message.appendChild(textnode);

    chatOutput.append(message);

    chatInput.value = "";
}

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        const chatInput = document.getElementById("chat-input");
        console.log(`sending ${chatInput.value}`);
        webSocket.send(chatInput.value);
    }
});

chatInput.focus();
playLocalVideo();