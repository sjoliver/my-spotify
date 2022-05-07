require('dotenv').config();

const express = require('express');
const app = express();
const port = 8888;
const querystring = require('querystring');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  const data = {
    name: 'Sophie',
    isCool: true
  };

  res.json(data);
});

app.get('/login', (req, res) => {
  const queryParans = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI
  })
  res.redirect(`https://accounts.spotify.com/authorize?${queryParans}`);
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

app.get('/cool-generator', (req, res) => {
  const { name, isCool } = req.query;

  res.send(`${name} is ${JSON.parse(isCool) ? 'really' : 'not'} cool`);
});
