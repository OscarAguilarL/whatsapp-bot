const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  msg = message.body;
  if (msg.includes("!ping")) {
    console.log(message.body);
    client.sendMessage(message.from, "pong");
  }
});

client.initialize();
