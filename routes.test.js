const request = require('supertest');
const { app } = require('./app');

test('/location should return the appropriate response', () => {
  request(app)
    .get('/location?search=portland')
    .expect(200)
    .expect((response) => {
      expect(response.body).toEqual({
        'formatted_query': 'Portland, Multnomah County, Oregon, USA',
        'latitude': '45.5202471',
        'longitude': '-122.6741949'
      });
    })
    .end(function(err, res) {
      if(err) throw err;
    });
});
