import http from 'http';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';

const portWebRTC = 5003;

export function createWebRTCSignalingServer({ port = portWebRTC } = {}) {
    const app = express();
    const httpServer = http.createServer(app);
    const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

    io.on('connection', (socket) => {
        console.log('A user connected via WebRTC signaling');

        socket.on('signal', (data) => {
            socket.broadcast.emit('signal', data);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected from WebRTC signaling');
        });
    });

    httpServer.listen(port, () => {
        console.log(`WebRTC signaling server running on port ${port}`);
    });

    return { app, httpServer, io };
}