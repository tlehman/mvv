const openMediaDevices = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

try {
    const stream = openMediaDevices({'video':true,'audio':true});
    console.log('Got MediaStream:', stream);
    const localVideo = document.querySelector("video#localVideo");
    localVideo.srcObject = stream;
} catch(error) {
    console.error('Error accessing media devices.', error);
}