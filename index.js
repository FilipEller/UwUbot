const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) {
  console.error('Telegram bot token required. Exiting...');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true }); // will change to { webHook: true }

bot.on('message', (msg) => {
  bot.sendMessage(
    msg.split(' ').map((word) => word.split('').reverse().join('')).join(" ")
  );
});
