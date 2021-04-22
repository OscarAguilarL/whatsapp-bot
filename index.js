// whatsapp-web.js library
const { Client } = require("whatsapp-web.js");

// qr-code-terminal library
const qrcode = require("qrcode-terminal");

// file system module from nodejs
const fs = require("fs");
const { count } = require("console");

// Path where the session data will be stored
const SESSION_FILE_PATH = "./session.json";

// Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData,
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on("auth_failure", msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
})

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");

    // Your country code, this one is for mexican users
    const country_code = "521";
    // Here is your phone number
    const number = "12234567890";
    // and the message you want to send
    const msg = "Hello, world!";

    client.sendMessage(`${country_code}${number}@c.us`, msg).then((response) => {
        if (response.id.fromMe) {
            console.log("It works!");
        }
    })

});

client.on("message", async (message) => {
    if (message.body === "Hola") {
        client.sendMessage(message.from, 'Mundo!');

    }
});

client.initialize();
