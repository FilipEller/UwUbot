require('dotenv').config();
const express = require('express');
const axios = require('axios');

const Uwuifier = require('uwuifier');
const uwuifier = new Uwuifier.default({
  spaces: { faces: 0.125, actions: 0.075, stutters: 0.175 },
  words: 1,
  exclamations: 1,
});

/*
DEFAULTS = {
    spaces: { faces: 0.05, actions: 0.075, stutters: 0.1 },
    words: 1,
    exclamations: 1,
}
*/

const { TOKEN } = process.env;
if (!TOKEN) {
  console.error('Telegram bot token required. Exiting...');
  process.exit(1);
}
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;

const app = express();
app.use(express.json());

const sendMessage = async (text, chat_id) => {
  try {
    const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      text,
      chat_id,
    });
    return res;
  } catch (e) {
    console.error(
      'Error sending message: ',
      e.message,
      e.response?.data?.description
    );
    return null;
  }
};

const answerInlineQuery = async (results, inline_query_id) => {
  try {
    const res = await axios.post(`${TELEGRAM_API}/answerInlineQuery`, {
      results,
      inline_query_id,
    });
    return res;
  } catch (e) {
    console.error(
      'Error answering inline query:',
      e.message,
      e.response?.data?.description
    );
    return null;
  }
};

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post(URI, async (req, res) => {
  const update = req.body;

  if (update.message) {
    const { message } = update;
    const { text, chat } = message;
    const { id, type } = chat;

    let msg;

    if (text && type === 'private') {
      if (
        text.toLowerCase().includes('/start') ||
        text.toLowerCase().includes('/help')
      ) {
        msg =
          'This bot can help translate your messages to UwU language. ' +
          'It works automatically, no need to add it anywhere. ' +
          'Simply open any of your chats and type @UwUrawrbot + something in the message field. ' +
          'Then tap on a result to send.\n\n' +
          'For example, try typing \n' +
          '@UwUrawrbot hello\n' +
          'in this chat.\n\n' +
          'Inline queries have a maximum length of 256 characters. ' +
          'If you want to translate longer messages, just send the message here, ' +
          'and the bot will reply with the translated version.';
      } else {
        msg = uwuifier.uwuifySentence(text);
      }
      await sendMessage(msg, id);
      return res.send();
    }
  }

  if (update.inline_query) {
    const { id: inline_query_id, query } = update.inline_query;

    const uwuified = uwuifier.uwuifySentence(query);
    const uwuText =
      query.length >= 252 ? uwuified + ' *runs away*' : uwuified || 'UwU';
    const description =
      uwuText.length > 90 ? uwuText.slice(0, 90) + '...' : uwuText;

    const input_message_content = {
      message_text: uwuText,
    };

    const inlineQueryResult = {
      type: 'article',
      id: String(Math.floor(Math.random() * 16)),
      title: 'Send UwU',
      input_message_content,
      description,
    };
    answerInlineQuery([inlineQueryResult], inline_query_id);
  }
  res.send();
});

app.listen(process.env.PORT || 5000, async () => {
  console.log('Listening on port', process.env.PORT || 5000);
});
