const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const geoData = require('./data/geo');
const weaData = require('./data/weather');

app.use(cors());

const getLetLong = (input) => {
  // Todo: make an api call (hard coded for now)
  const city = geoData[0];
  return {
    formatted_query: city.display_name,
    latitude: city.lat,
    longitude: city.lon
  };
};

const getWeather = (lat, lon) => {
  //Todo: make an api call for now its hard coded
  const data = weaData.data;
  const forcArray = data.map(weatherItem => {
    return {
      forecast: weatherItem.weather.description,
      time: new Date(weatherItem.ts * 1000)
    }
  })
  return forcArray;
}

app.get('/location', (req, res) => {
  try {
    const userInput = req.query.search;
    console.log(userInput);
    const munged = getLetLong(userInput);
    res.json(munged);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', (req, res) => {
  try {
    const userLat = req.query.latitude;
    const userLon = req.query.longitude;
    const mungedData = getWeather(userLat, userLon);
    res.json(mungedData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
