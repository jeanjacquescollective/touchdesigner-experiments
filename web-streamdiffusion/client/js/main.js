
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const img = document.getElementById('frame');

const currentIP = 'localhost'; // Change this to your server's IP address
const currentPort = '5002';
const currentURL = `ws://${currentIP}:${currentPort}`;
const socket = new WebSocket(currentURL);

socket.binaryType = 'arraybuffer';

socket.onopen = () => {
  console.log('WebSocket connected.');
};

socket.onmessage = (event) => {
  const buffer = event.data;
  const text = new TextDecoder().decode(buffer);

  try {
    const json = JSON.parse(text);
    if (json.type === 'frame' && json.data) {
      img.src = 'data:image/jpeg;base64,' + json.data;
    } else {
      console.warn('Unexpected message:', json);
    }
    if (json.type === 'updated-prompt') {
      document.getElementById('currentPrompt').textContent = json.data;
    }

  } catch (e) {
    console.error('Error parsing frame:', e);
  }
};

socket.onerror = (err) => {
  console.error('WebSocket error:', err);
};

socket.onclose = () => {
  console.warn('WebSocket connection closed');
};


sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message && socket.readyState === WebSocket.OPEN) {
    const json = JSON.stringify({
      type: 'updated-prompt',
      message: message
    });
    document.getElementById('currentPrompt').textContent = message;
    console.log('Sending message:', json);
    socket.send(json);
    messageInput.value = '';
  }
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});