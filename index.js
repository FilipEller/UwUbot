require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Uwuifier = require('uwuifier');

const uwuifier = new Uwuifier.default();

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
    console.error('Error sending message: ', e.message);
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
    console.log('Error answering inline query:', e.response?.data?.description);
    return null;
  }
};

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post(URI, async (req, res) => {
  console.log('update', req.body);
  const update = req.body;

  if (update.message) {
    const { message } = update;
    const {
      text,
      chat: { id },
    } = message;

    if (text.startsWith('/')) {
      if (text) {
        const msg = text
          .split(' ')
          .map((word) => word.split('').reverse().join(''))
          .join(' ');

        await sendMessage(msg, id);
        return res.send();
      }
    }
  }

  if (update.inline_query) {
    const { id: inline_query_id, query } = update.inline_query;

    const uwuText = uwuifier.uwuifySentence(query) || 'UwU';
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
    console.log('result:', inlineQueryResult);
    answerInlineQuery([inlineQueryResult], inline_query_id);
  }
  res.send();
});

app.listen(process.env.PORT || 5000, async () => {
  console.log('Listening on port', process.env.PORT || 5000);
});

// msg.split(' ').map((word) => word.split('').reverse().join('')).join(' ')
