// qr-code-terminal library
const qrcode = require("qrcode-terminal");

// file system module from nodejs
const fs = require("fs");
const { Client } = require("whatsapp-web.js");

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

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
	console.log("Client is ready!");
});

const goodDays = [
	"Buenos días",
	"Buen dia",
	"Diaaasssss",
];

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

client.on("message", (message) => {
	console.log(message.getContact());

	msg = message.body;

	if (msg.includes("Buenos días") || msg.includes("Buenos dias")) {
		let y = Math.round(getRandomArbitrary(0, goodDays.length));
		client.sendMessage(message.from, goodDays[y]);
	}
});

client.initialize();
