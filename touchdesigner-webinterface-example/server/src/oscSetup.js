import { Client, Server } from 'node-osc';
import dotenv from "dotenv";

dotenv.config();


const oscPort = process.env.OSC_PORT || 10000;
const oscHost = process.env.OSC_HOST  || 'localhost';
const oscServerPort = process.env.OSC_SERVER_PORT || 10001;

const client = new Client(oscHost,oscPort);

const oscServer = new Server(oscServerPort, oscHost, () => {
  console.log('OSC Server is listening on port ' + oscServerPort + '...');
});

oscServer.on('message', function (msg) {
  console.log(`Message: ${msg}`);
//   oscServer.close();
});

const sendOSCMessage = (address, value) => {
    client.send(address, parseFloat(value));
    console.log(`Send message ${address}, ${value}`)
}
client.send('/oscAddress', 12, () => {
//   client.close();
});

export { sendOSCMessage, client}