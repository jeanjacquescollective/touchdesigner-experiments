// websocket.js
let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

export function initializeWebSocket(onMessage, onOpen, onClose, onError) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.hostname}:5001`;
  socket = new WebSocket(wsUrl);

  socket.addEventListener('open', (event) => {
    reconnectAttempts = 0;
    onOpen(event);
  });

  socket.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data);
      onMessage(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  socket.addEventListener('close', (event) => {
    onClose(event);
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      setTimeout(() => initializeWebSocket(onMessage, onOpen, onClose, onError), 3000);
    }
  });

  socket.addEventListener('error', (event) => {
    onError(event);
  });
}

export function sendUpdate(type, value) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, value }));
  } else {
    console.warn('Cannot send update: WebSocket is not connected');
  }
}
