# TouchDesigner Web Interface Example

This project demonstrates how to create a web interface for a TouchDesigner installation, enabling real-time interaction and visualization via a browser. It is structured for an interactive IKEA Living Spaces installation, but can be adapted for other TouchDesigner projects.

## Features

- **Real-time Web Interface:** Control and visualize TouchDesigner parameters from any browser.
- **OSC Integration:** Uses OSC for communication between Node.js server and TouchDesigner.
- **3D Asset Support:** Includes sample IKEA 3D models for visualization.
- **Modular Frontend:** Clean separation of UI, events, theming, and WebSocket logic.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [TouchDesigner](https://derivative.ca/)

### 1. Install Server Dependencies

```sh
cd server
npm install
```

### 2. Start the Node.js Server

```sh
npm start
```

The server will handle WebSocket and OSC communication.

### 3. Open the Web Client

Open `client/index.html` in your browser. (You may need to serve it via a local web server for WebSocket security.)

### 4. Open the TouchDesigner Project

Open `touchdesigner/ikea-visualisation.toe` in TouchDesigner.

### 5. Connect Everything

Ensure TouchDesigner is configured to send/receive OSC messages to/from the Node.js server (see `server/src/oscSetup.js`).

Interact with the web interface to control or visualize the TouchDesigner project in real time.

## Customization

- Add or modify 3D models in `touchdesigner/assets/3d/`.
- Adjust frontend UI in `client/`.
- Extend OSC logic in `server/src/oscSetup.js`.

## License

MIT License

**Author:** Jannes Lambrecht
**Year:** 2025