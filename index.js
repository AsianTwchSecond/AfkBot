const mineflayer = require("mineflayer")

const bot = mineflayer.createBot({
  host: "bingungsmp.top",
  username: "AltNiXac",
  version: false
})

function startBot() {
  console.log("Starting bot...")

  bot.once("spawn", () => {
    console.log("Bot spawned")

    setTimeout(() => {
      bot.chat("/login kurtalle")
    }, 3000)

    setTimeout(() => {
      bot.chat("/server ecocpvp")
    }, 6000)

    // Auto jump every 5 seconds
    setInterval(() => {
      bot.setControlState("jump", true)
      setTimeout(() => {
        bot.setControlState("jump", false)
      }, 300)
    }, 5000)
  })

  bot.on("end", () => {
    console.log("Bot disconnected, restarting in 5s")
    setTimeout(startBot, 5000)
  })

  bot.on("error", err => console.log("Error:", err))
}

startBot()