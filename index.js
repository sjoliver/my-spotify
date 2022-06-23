import dotenv from 'dotenv'
dotenv.config()

import express from 'express' 
const app = express();
const port = 8888;

import querystring from 'querystring'
import axios from 'axios';

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

const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const stateKey = 'spotify_auth_state';

// request authorization to access data from Spotify by sending a get request (redirect to) 
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'user-read-private user-read-email';

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: scope,
    state: state
  })

  // authorizes access, then prompts user to log in to Spotify, user is redirected to REDIRECT_URI
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
  // authorization code included in request query params is stored inside 'code' variable
  const code = req.query.code || null;

  // use authorization code to request access token by sending a post request to /api/token
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  // spotify confirms authorization code validity, then responds with access token and refresh token
  .then(response => {
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in,
      });

      res.redirect(`http://localhost:3000/?${queryParams}`);

    } else {
      res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
    }
  })
  .catch(error => {
    res.send(error);
  });
});

// use the refresh_token to retrieve another access token once current token expires (so user doesn't have to login every 60 mins)
app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  // refresh token included in request query params > Spotify confirms validty of refresh token, then response with new access token
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

app.get('/cool-generator', (req, res) => {
  const { name, isCool } = req.query;

  res.send(`${name} is ${JSON.parse(isCool) ? 'really' : 'not'} cool`);
});
