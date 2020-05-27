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

const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
chatInput.addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        var message = document.createElement("li");
        var date = (new Date()).toISOString();
        var textnode = document.createTextNode(date + ": " + chatInput.value);
        message.appendChild(textnode);

        chatOutput.appendChild(message)

        chatInput.value = "";
    }
});

const wsurl = window.location.href.replace("http", "ws");
const webSocket = new WebSocket(wsurl);

chatInput.focus();
playLocalVideo();