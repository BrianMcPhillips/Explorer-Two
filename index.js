const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const geoData = require('./data/geo');

app.use(cors());



app.get('/location', (req, res) => {
  const userInput = req.query.search;
  console.log(userInput);
  res.json({
    formatted_query: 'Seattle, WA, USA',
    latitude: '47.606210',
    longitude: '-122.332071'
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})