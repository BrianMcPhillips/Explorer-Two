require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const request = require('superagent');

app.use(cors());

const {
  LOCATION_IQ,
  WEATHER,
  REVIEW,
  HIKE
} = process.env;

const getLatLong = async(input) => {
  const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${LOCATION_IQ}&q=${input}&format=json`);
  const city = response.body[0];
  return { 
    formatted_query: city.display_name,
    latitude: city.lat,
    longitude: city.lon
  };
};

const getWeather = async(lat, lon) => {
  const data = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&units=I&key=${WEATHER}`);
  const response = data.body.data;
  const forcArray = response.map(weatherItem => {
    return {
      forecast: weatherItem.weather.description,
      time: new Date(weatherItem.ts * 1000)
    }
  });
  return forcArray;
}

const getReviews = async(lat, lon) => {
  const data = await request
    .get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`)
    .set('Authorization', 'Bearer ' + REVIEW);
  const reviews = data.body.businesses;
  const revArray = reviews.map(review => {
    return {
      name: review.name,
      image_url: review.image_url,
      price: review.price,
      rating: review.rating,
      url: review.url
    }
  });
  return revArray;
}

const getHikes = async(lat, lon) => {
  const data = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${HIKE}`);
  const hikes = data.body.trails;
  const hikeArr = hikes.map(hike => {
    return {
      name: hike.name,
      location: hike.location,
      length: hike.length,
      stars: hike.stars,
      star_votes: hike.starVotes,
      summary: hike.summary,
      trail_url: hike.url,
      conditions: hike.conditionStatus,
      condition_date: hike.conditionDate.split(' ')[0],
      condition_time: hike.conditionDate.split(' ')[1]
    }
  });
  return hikeArr;
}

app.get('/location', async(req, res) => {
  try {
    const userInput = req.query.search;
    const munged = await getLatLong(userInput);
    res.json(munged);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async(req, res) => {
  try {
    const userLat = req.query.latitude;
    const userLon = req.query.longitude;
    const mungedData = await getWeather(userLat, userLon);
    res.json(mungedData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/reviews', async(req, res) => {
  try {
    const userLat = req.query.latitude;
    const userLon = req.query.longitude;
    const mungedData = await getReviews(userLat, userLon);
    res.json(mungedData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/trails', async(req, res) => {
  try {
    const userLat = req.query.latitude;
    const userLon = req.query.longitude;
    const mungedData = await getHikes(userLat, userLon);
    res.json(mungedData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = {
  app
};
