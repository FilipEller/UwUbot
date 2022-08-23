require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Uwuifier = require('uwuifier');

const { TOKEN, SERVER_URL } = process.env;
if (!TOKEN) {
  console.error('Telegram bot token required. Exiting...');
  process.exit(1);
}
if (!SERVER_URL) {
  console.error('Server URL required. Exiting...');
  process.exit(1);
}

const uwuifier1 = new Uwuifier.default({
  spaces: { faces: 0.11, actions: 0, stutters: 0.12 },
});
const uwuifier2 = new Uwuifier.default({
  spaces: { faces: 0.11, actions: 0.1, stutters: 0.12 },
});
const uwuifier3 = new Uwuifier.default({
  spaces: { faces: 0.2, actions: 0.17, stutters: 0.25 },
});
/*
const DEFAULTS = {
  SPACES: { faces: 0.05, actions: 0.075, stutters: 0.1 },
  WORDS: 1,
  EXCLAMATIONS: 1,
};
*/

const actions = [
  '*blushes*',
  '*whispers to self*',
  '*cries*',
  '*screams*',
  '*sweats*',
  '*twerks*',
  '*screeches*',
  '*sees bulge*',
  '*looks at you*',
  '*notices buldge*',
  '*starts twerking*',
  '*huggles tightly*',
  '*boops your nose*',
  '*bites lip*',
  '*looks away*',
  '*sheds a tear*',
  '*meows*',
  '*hesitates*',
  '*plays with hair*',
  '*sits down*',
  '*stands up*',
  '*lies down*',
  '*looks down*',
  '*bows*',
  '*woofs*',
  '*rawrs*',
  '*peels a banana*',
  '*sighs*',
  '*whimpers*',
];
// const removed = ['*runs away*', '*walks away*'];

const uwuifiers = [uwuifier1, uwuifier2, uwuifier3];
uwuifiers.forEach((obj) => (obj.actions = actions));

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;

const app = express();
app.use(express.json());
app.use(express.static('public'));

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
    const info =
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

    if (text && type === 'private') {
      if (
        text.toLowerCase().includes('/start') ||
        text.toLowerCase().includes('/help')
      ) {
        msg = info;
      } else if (
        text.toLowerCase().includes('/stawt') ||
        text.toLowerCase().includes('/hewp')
      ) {
        msg = uwuifier2.uwuifySentence(info);
      } else {
        msg = uwuifier2.uwuifySentence(text);
      }
      await sendMessage(msg, id);
      return res.send();
    }
  }

  if (update.inline_query) {
    const { id: inline_query_id, query } = update.inline_query;

    const translations = uwuifiers.map((uwuifier) =>
      uwuifier.uwuifySentence(query)
    );
    const texts = translations.map((translation) =>
      query.length >= 252 ? translation + ' *runs away*' : translation || 'UwU'
    );
    const descriptions = translations.map((translation) =>
      translation.length > 85 ? translation.slice(0, 85) + '...' : translation
    );
    const placeholders = ['UwU', 'OwO', '>w<'];

    const titles = ['Send UwU', 'Send OwO', 'Send >w<'];
    const results = [...Array(uwuifiers.length)].map((_, i) => ({
      type: 'article',
      id: i,
      title: titles[i],
      input_message_content: {
        message_text: texts[i],
      },
      description: descriptions[i] || placeholders[i],
      thumb_url: `${SERVER_URL}/images/thumbnail-00${i + 1}.jpeg`,
      thumb_width: 10,
      thumb_height: 10,
    }));

    answerInlineQuery(results, inline_query_id);
  }
  res.send();
});

app.listen(process.env.PORT || 5000, async () => {
  console.log('Listening on port', process.env.PORT || 5000);
});
