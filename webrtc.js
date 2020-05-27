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

playLocalVideo();