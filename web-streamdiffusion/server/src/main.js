import { WebSocketServer, WebSocket } from 'ws';
import { createWebRTCSignalingServer } from './webRTC.js';

const portWebSocket = 5002;

// Create a WebSocket server
const wss = new WebSocketServer({ port: portWebSocket });

wss.on('connection', (ws) => {
    console.log('A user connected via WebSocket');

    ws.on('message', (message) => {
        // console.log('Received message via WebSocket:', message);
        const data = JSON.parse(message.toString());

        if (data.type === 'updated-prompt') {
            message = JSON.stringify({
                type: 'updated-prompt',
                data: data.message
            });
        }
        // Broadcast to all other connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        // console.log('Broadcasted message to all WebSocket clients:', message);
    });

    ws.on('close', () => {
        console.log('A user disconnected from WebSocket');
    });
});

console.log(`Pure WebSocket server running on port ${portWebSocket}`);

// createWebRTCSignalingServer({
//     port: 5003
// });