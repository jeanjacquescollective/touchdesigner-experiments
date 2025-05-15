import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import { sendOSCMessage } from "./oscSetup.js";

dotenv.config();
const hostname = process.env.HOSTNAME || "localhost";
const webSocketPort = process.env.WEBSOCKET_PORT || 8080;


// Create WebSocket server
const wss = new WebSocketServer({ port: webSocketPort });

// Keep track of all connected clients
const clients = new Set();

// Data state that will be shared with all clients
let currentState = {
  furnitureCategory: "storage",
  colorScheme: "blue",
  sustainabilityLevel: 50,
  populationDensity: 40,
  roomWidth: 500,
  roomLength: 300,
  popularItems: [

  ]
};

console.log(`WebSocket server is running on ws://${hostname}:${webSocketPort}`);

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.add(ws);

  // Send current state to new client
  ws.send(
    JSON.stringify({
      type: "state_update",
      data: currentState
    })
  );

  if (wss.clients.size === 1) {
    console.log("Starting keep alive");
    startKeepAlive();
  }

  ws.on("error", console.error);

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      console.log("Received message:", parsedMessage);

      // Process different message types
      switch (parsedMessage.type) {
        case "update_category":
          currentState.furnitureCategory = parsedMessage.value;
          break;
        case "update_color":
          currentState.colorScheme = parsedMessage.value;
          break;
        case "update_sustainability":
          currentState.sustainabilityLevel = parsedMessage.value;
          break;
        case "update_population":
          currentState.populationDensity = parsedMessage.value;
          break;
        case "update_room_dimensions":
          currentState.roomWidth = parsedMessage.value.width;
          currentState.roomLength = parsedMessage.value.length;
          break;
        case "sorted_elements":
          currentState.popularItems = parsedMessage.value.map((item) => {
            return {
              name: item.name,
              count: item.count,
              product_id: item.product_id,
              product_name: item.product_name,
              category: item.category,
              price: item.price,
              sustainability_rating: item.sustainability_rating,
              units_sold: item.units_sold,
              country: item.country,
              popularity_score: item.popularity_score,
              material: item.material
            };
          });
          console.log("Updated popular items:", currentState.popularItems);
          break;
        default:
          console.log("Unknown message type:", parsedMessage.type);
      }

      // Broadcast updated state to all clients
      broadcastState();

      // Handle OSC message sending
      Object.keys(parsedMessage).forEach((key) => {
        sendOSCMessage(`/${key}`, parsedMessage[key]);
      });
    } catch (error) {
      console.error("Error processing message:", error);

    }
  }
);})

const startKeepAlive = () => {
  setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send("ping");
      }
    });
  }, 50000); // Send a ping every 30 seconds
};

const broadcastState = () => {
  const stateMessage = JSON.stringify({
    type: "state_update",
    data: currentState
  });

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(stateMessage);
    }
  });
}
