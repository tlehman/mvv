# MVV (Minimum Viable Videoconferencing)

This demo uses [WebRTC](https://webrtc.org) to build a basic Videoconferencing application like Zoom and Amazon Chime.

## Scenario: Alice and Bob want to chat

Alice opens http://mvv.chat/ab and gives her browser permission to use the camera and microphone.

Alice copies the URL http://mvv.chat/ab and sends it to Bob

Bob opens http://mvv.chat/ab and sees Alice, they start talking.

## Implementation
The first thing we need to do is get the client's video stream:

``` javascript
navigator.mediaDevices.getUserMedia({'video':true,'audio':true});
```
This will return a [javascript promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that wraps a `MediaStream` object. That `MediaStream` contains the client's video and audio stream.

Then, we need to attach the client's video stream to a `<video>` html element.

Assume the element looks like this:

``` html
<video id="localVideo" autoplay playsinline controls="false" />
```

Now we need to glue the `MediaStream` to the `localVideo` element.

``` javascript
const localVideo = document.getElementById("localVideo");
localVideo.srcObject = stream;
```
Next, Alice needs to form a peer-to-peer connection with Bob so she can attach his remote MediaStream to her `remoteVideo` html element.

In order for Alice and Bob to be able to initiate a peer-to-peer connection, they need a signaling channel, which the WebRTC specification doesn't specify. Let's use a [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

