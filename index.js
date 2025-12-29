const mineflayer = require('mineflayer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let bot = null;
let chatLogs = [];
let status = "Offline";

function log(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
  console.log(line);
  chatLogs.push(line);
  if (chatLogs.length > 100) chatLogs.shift();
}

function startBot() {
  if (bot) return;

  log("Starting bot...");
  status = "Connecting";

  bot = mineflayer.createBot({
    host: "bingungsmp.top",
    port: 25565,
    username: "AltNiXac",
    version: false
  });

  bot.once("spawn", () => {
    status = "Online";
    log("Bot spawned");

    setTimeout(() => {
      bot.chat("/login kurtalle");
      log("Sent /login");
    }, 2000);

    setTimeout(() => {
      bot.chat("/server ecocpvp");
      log("Sent /server ecocpvp");
    }, 5000);

    // Jump every 5 seconds
    setInterval(() => {
      if (!bot) return;
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 300);
    }, 5000);
  });

  bot.on("chat", (username, message) => {
    log(`<${username}> ${message}`);
  });

  bot.on("end", () => {
    log("Disconnected");
    status = "Disconnected";
    bot = null;
    setTimeout(startBot, 5000);
  });

  bot.on("error", err => {
    log("Error: " + err.message);
  });
}

startBot();


// 🌐 API
app.get("/status", (req, res) => {
  res.json({ status, chatLogs });
});

app.post("/command", (req, res) => {
  if (!bot) return res.json({ ok: false });
  bot.chat(req.body.cmd);
  log("Command: " + req.body.cmd);
  res.json({ ok: true });
});

app.post("/rejoin", (req, res) => {
  if (bot) bot.quit();
  bot = null;
  startBot();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Web server running on port", PORT);
});
