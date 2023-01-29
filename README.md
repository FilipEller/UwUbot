# UwUrawrbot

This is a Telegram bot for translating messages to UwU language.
Contact [@UwUrawrbot](https://t.me/UwUrawrbot) to start using.
The bot is hosted on Azure.

## Getting started

### Prerequisites

1. Talk to Telegram's [BotFather](https://t.me/BotFather) to acquire a HTTP API token
1. Store the token in the file `.env` in the project root as TOKEN
1. For running on localhost, set up [ngrok](https://ngrok.com/docs/getting-started)
1. Fro running on a web host, store the server's web address in the same file as SERVER_URL
   
### Running the app

On a web host:
1. Start a terminal in the project root
1. `npm install`
1. `npm run webhook:set`
1. `run npm start`

For development on localhost:
1. Start a terminal in the project root
1. `ngrok http 5000`
1. Store the ngrok server's address in the file `.env` file as SERVER_URL
1. `npm install`
1. `npm run webhook:set`
1. `npm run dev`

## Image sources

https://emoji.gg/emoji/3391-uwu  
https://coolors.co/ffadad-ffd6a5-fdffb6-caffbf-9bf6ff-a0c4ff-bdb2ff-ffc6ff-fffffc  
https://mdigi.tools/solid-color-image-generator/ size 100x100  
https://pixelied.com/ font Amiko, fontsize 30  
