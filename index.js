const mineflayer = require('mineflayer');
const express = require('express');
const bodyParser = require('body-parser');

/* =====================
   🌐 WEBSITE
===================== */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

let bot;
let botStatus = 'Starting...';
let chatLogs = [];
let reconnecting = false;

function addLog(msg) {
  const time = new Date().toLocaleTimeString();
  chatLogs.push(`[${time}] ${msg}`);
  if (chatLogs.length > 80) chatLogs.shift();
}

app.get('/', (req, res) => {
  res.send(`
  <html>
    <head>
      <title>AFK Bot Dashboard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          background:#0f172a;
          color:#e5e7eb;
          font-family:Arial;
          padding:16px;
        }
        h1 { color:#38bdf8; }
        .box {
          background:#020617;
          padding:14px;
          border-radius:10px;
          margin-bottom:14px;
        }
        textarea {
          width:100%;
          height:220px;
          background:#020617;
          color:#e5e7eb;
          border:1px solid #334155;
          border-radius:8px;
        }
        input, button {
          padding:8px;
          border-radius:6px;
          border:none;
        }
        button {
          background:#38bdf8;
          cursor:pointer;
          margin-top:6px;
        }
      </style>
    </head>
    <body>
      <h1>Cracked SMP AFK Bot</h1>

      <div class="box">
        <b>Status:</b> ${botStatus}
      </div>

      <div class="box">
        <h3>Send Command / Chat</h3>
        <form method="POST" action="/send">
          <input name="cmd" placeholder="/warp spawn" style="width:70%">
          <button type="submit">Send</button>
        </form>

        <form method="POST" action="/rejoin">
          <button type="submit">🔁 Rejoin Server</button>
        </form>
      </div>

      <div class="box">
        <h3>Chat Logs</h3>
        <textarea readonly>${chatLogs.join('\n')}</textarea>
      </div>
    </body>
  </html>
  `);
});

app.post('/send', (req, res) => {
  if (bot && bot.player && req.body.cmd) {
    bot.chat(req.body.cmd);
    addLog(`[YOU] ${req.body.cmd}`);
  }
  res.redirect('/');
});

app.post('/rejoin', (req, res) => {
  if (bot && !reconnecting) {
    reconnecting = true;
    addLog('[WEB] Rejoin requested');
    bot.quit('Manual rejoin');
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`🌐 Website online on port ${PORT}`);
});

/* =====================
   🤖 BOT
===================== */
function startBot() {
  botStatus = 'Connecting...';

  bot = mineflayer.createBot({
    host: 'bingungsmp.top',
    username: 'AltNiXac',
    onlineMode: false
  });

  bot.on('login', () => {
    botStatus = 'Online';
    reconnecting = false;
    addLog('[BOT] Logged in');
    console.log('✅ Logged in');

    // Auto /login
    setTimeout(() => {
      bot.chat('/login kurtalle');
      addLog('[BOT] /login kurtalle');
    }, 1500);

    // AFK movement
    setInterval(() => {
      bot.setControlState('forward', true);
      setTimeout(() => bot.clearControlStates(), 2000);
    }, 8000);

    // Jump every 5 seconds
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 250);
    }, 5000);
  });

  bot.on('chat', (username, message) => {
    const line = `<${username}> ${message}`;
    console.log(line);
    addLog(line);
  });

  bot.on('kicked', reason => {
    botStatus = 'Kicked';
    addLog('[KICKED] ' + reason);
    console.log('KICKED:', reason);
  });

  bot.on('end', () => {
    botStatus = 'Disconnected';
    addLog('[DISCONNECTED]');
    console.log('Disconnected');

    setTimeout(() => {
      startBot();
    }, 5000);
  });

  bot.on('error', err => {
    botStatus = 'Error';
    addLog('[ERROR] ' + err.message);
    console.log(err);
  });
}

startBot();
