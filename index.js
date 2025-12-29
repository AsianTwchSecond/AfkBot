const mineflayer = require('mineflayer');
const http = require('http');

function startBot() {
  const bot = mineflayer.createBot({
    host: 'bingungsmp.top',
    port: 25565,
    username: 'AltNiXac',
    version: false
  });

  console.log('Bot starting');

  bot.on('spawn', () => {
    console.log('Spawned');

    setTimeout(() => {
      bot.chat('/login kurtalle');

      setTimeout(() => {
        bot.chat('/server ecocpvp');
      }, 3000);

    }, 1000);

    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }, 5000);
  });

  bot.on('end', () => {
    console.log('Disconnected, restarting...');
    setTimeout(startBot, 5000);
  });
}

// HTTP server (IMPORTANT)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('AFK bot alive');
}).listen(process.env.PORT || 3000);

startBot();
