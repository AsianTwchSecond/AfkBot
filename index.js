const mineflayer = require("mineflayer")
const express = require("express")

/* ---------------- WEBSITE ---------------- */
const app = express()
app.get("/", (req, res) => {
  res.send("Bot is running 🟢")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Website running on port", PORT)
})

/* ---------------- BOT ---------------- */
function startBot() {
  console.log("Starting bot...")

  const bot = mineflayer.createBot({
    host: "bingungsmp.top",
    username: "AltNiXac",
    version: false
  })

  bot.once("spawn", () => {
    console.log("Bot spawned")

    setTimeout(() => bot.chat("/login kurtalle"), 3000)
    setTimeout(() => bot.chat("/server ecocpvp"), 6000)

    // Auto jump only
    setInterval(() => {
      bot.setControlState("jump", true)
      setTimeout(() => bot.setControlState("jump", false), 250)
    }, 5000)
  })

  bot.on("end", () => {
    console.log("Disconnected. Restarting in 5s...")
    setTimeout(startBot, 5000)
  })

  bot.on("error", err => console.log("Bot error:", err))
}

startBot()