// main.js
import { initializeWebSocket } from './websocket.js';
import { initializeEventListeners } from './events.js';
import { updateUIWithNewState } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeWebSocket(
    (message) => {
      if (message.type === 'state_update') {
        updateUIWithNewState(message.data);
      }
    },
    () => {
      document.getElementById('connection-status').textContent = 'Connected';
      document.getElementById('connection-status').className = 'status-connected';
    },
    () => {
      document.getElementById('connection-status').textContent = 'Disconnected';
      document.getElementById('connection-status').className = 'status-disconnected';
    },
    () => {
      document.getElementById('connection-status').textContent = 'Error';
      document.getElementById('connection-status').className = 'status-error';
    }
  );

  initializeEventListeners();
});
