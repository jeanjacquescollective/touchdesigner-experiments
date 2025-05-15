# Stream TouchDesigner to Web

This project demonstrates how to stream real-time video or image frames from a [TouchDesigner](https://derivative.ca/) project to a web browser using Node.js, WebSockets, and simple web clients. It is ideal for interactive installations, remote monitoring, or creative coding projects where you want to view or broadcast TouchDesigner output over a network.

## Features

- **Live MJPEG Streaming:** Serve TouchDesigner output as a live MJPEG stream viewable in any browser.
- **WebSocket Frame Streaming:** Stream frames as JPEGs over WebSockets for low-latency, real-time updates.
- **Multiple Client Examples:** Includes both a simple HTTP client and a WebSocket client for flexibility.
- **Easy Integration:** Minimal setup required for both server and client.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the server)
- [TouchDesigner](https://derivative.ca/) (for the .toe project)
- Modern web browser

### 1. Run the WebSocket Server

```sh
cd websockets/server
npm install
npm start
```

### 2. Open the Web Client

Open `websockets/client/index.html` in your browser.  
You should see a live frame streamed from TouchDesigner (once everything is connected).

### 3. Open the TouchDesigner Project

Open `stream-touchdesigner-to-web.toe` in TouchDesigner.  
Configure your TouchDesigner project to send frames (as JPEG or image data) to the Node.js server.  
*Note: The exact setup depends on your TouchDesigner network. Typically, you use a Video Stream Out TOP or a custom Python DAT to send frames via OSC, TCP, or HTTP POST.*

### 4. (Optional) Use the MJPEG HTTP Client

You can also open `webserver-client/index.html` to view a simple MJPEG stream (if your server is set up to serve it).

## How It Works

1. TouchDesigner exports frames (as JPEGs or image buffers) to the Node.js server.
2. The Node.js server receives the frames and broadcasts them to all connected WebSocket clients, or serves them as MJPEG over HTTP.
3. Web clients display the live frames in real time.

## Customization

- Modify the server code to change ports or add authentication.
- Adjust the TouchDesigner network to control frame rate, resolution, or encoding.
- Style or extend the web clients as needed for your installation.

## License

*MIT License

**Author:** Jannes Lambrecht
**Year:** 2025