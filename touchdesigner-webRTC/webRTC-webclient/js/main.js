// WebRTC configuration

// Fetch TURN server credentials and initialize WebRTC after fetching
async function initWebRTC() {
    // Fetch TURN server credentials
    const response = await fetch(
        "https://arteveldeturn.metered.live/api/v1/turn/credentials?apiKey=120f2f134c75cf21d89bab84ec9f456c70dd"
    );
    const iceServers = await response.json();
    console.log("Fetched ICE servers:", iceServers);
    // Combine fetched iceServers with default STUN server
    const config = {
        iceServers: [
            ...iceServers,
            { urls: "stun:stun.l.google.com:19302" },
        ],
    };

    // The rest of your WebRTC code goes here, but needs to use 'config'
    // Move all code that depends on 'config' inside this function

    
const ws = new WebSocket("ws://localhost:9980");
const pc = new RTCPeerConnection(config);
const remoteVideo = document.getElementById("remoteVideo");

// Handle incoming ICE candidates from TouchDesigner
ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);

  // TouchDesigner wraps signaling messages in a 'signalingType' and 'content'
  if (msg.signalingType === "Offer" && msg.content && msg.content.sdp) {
    // Ensure the sdp object has 'type' and 'sdp' properties
    console.log("Received offer:", msg.content.sdp);
    await pc.setRemoteDescription(
      new RTCSessionDescription({
        type: "offer",
        sdp: msg.content.sdp,
      })
    );
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    // Respond using TouchDesigner’s expected format
    ws.send(
      JSON.stringify({
        signalingType: "Answer",
        content: { sdp: pc.localDescription },
        metadata: msg.metadata || {},
        sender: "webclient",
      })
    );
  } else if (msg.signalingType === "Answer" && msg.content && msg.content.sdp) {
    await pc.setRemoteDescription(
      new RTCSessionDescription({
        type: msg.content.sdp.type,
        sdp: msg.content.sdp.sdp,
      })
    );
  } else if (
    msg.signalingType === "IceCandidate" &&
    msg.content &&
    msg.content.candidate
  ) {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({
            signalingType: "IceCandidate",
            content: { candidate: event.candidate },
            sender: "webclient",
          })
        );
      }
    };
  }
};

// Send ICE candidates to TouchDesigner
pc.onicecandidate = (event) => {
  if (event.candidate) {
    ws.send(JSON.stringify({ candidate: event.candidate }));
  }
};

// Display remote stream
pc.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};

// Ready to start negotiation
ws.onopen = () => {
  ws.send(JSON.stringify({ action: "ready" }));
};

}

// Start everything
initWebRTC();

// const ws = new WebSocket("ws://localhost:9980");
// const pc = new RTCPeerConnection(config);
// const remoteVideo = document.getElementById("remoteVideo");

// // Handle incoming ICE candidates from TouchDesigner
// ws.onmessage = async (event) => {
//   const msg = JSON.parse(event.data);

//   // TouchDesigner wraps signaling messages in a 'signalingType' and 'content'
//   if (msg.signalingType === "Offer" && msg.content && msg.content.sdp) {
//     // Ensure the sdp object has 'type' and 'sdp' properties
//     console.log("Received offer:", msg.content.sdp);
//     await pc.setRemoteDescription(
//       new RTCSessionDescription({
//         type: "offer",
//         sdp: msg.content.sdp,
//       })
//     );
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     // Respond using TouchDesigner’s expected format
//     ws.send(
//       JSON.stringify({
//         signalingType: "Answer",
//         content: { sdp: pc.localDescription },
//         metadata: msg.metadata || {},
//         sender: "webclient",
//       })
//     );
//   } else if (msg.signalingType === "Answer" && msg.content && msg.content.sdp) {
//     await pc.setRemoteDescription(
//       new RTCSessionDescription({
//         type: msg.content.sdp.type,
//         sdp: msg.content.sdp.sdp,
//       })
//     );
//   } else if (
//     msg.signalingType === "IceCandidate" &&
//     msg.content &&
//     msg.content.candidate
//   ) {
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         ws.send(
//           JSON.stringify({
//             signalingType: "IceCandidate",
//             content: { candidate: event.candidate },
//             sender: "webclient",
//           })
//         );
//       }
//     };
//   }
// };

// // Send ICE candidates to TouchDesigner
// pc.onicecandidate = (event) => {
//   if (event.candidate) {
//     ws.send(JSON.stringify({ candidate: event.candidate }));
//   }
// };

// // Display remote stream
// pc.ontrack = (event) => {
//   remoteVideo.srcObject = event.streams[0];
// };

// // Ready to start negotiation
// ws.onopen = () => {
//   ws.send(JSON.stringify({ action: "ready" }));
// };
