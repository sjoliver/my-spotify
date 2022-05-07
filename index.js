require('dotenv').config();

const express = require('express');
const app = express();
const port = 8888;

app.get('/', (req, res) => {
  const data = {
    name: 'Sophie',
    isCool: true
  };

  res.json(data);

  console.log('hello')
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

app.get('/cool-generator', (req, res) => {
  const { name, isCool } = req.query;

  res.send(`${name} is ${JSON.parse(isCool) ? 'really' : 'not'} cool`);
});
