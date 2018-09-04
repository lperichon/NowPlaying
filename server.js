const express = require('express');
const Twitter = require('twit');

const app = express();
const client = new Twitter({
  consumer_key: 'CXVNsTDohsJaIxl0cjpuLKXYr',
  consumer_secret: 'Y49dNi2NPN9vJaPS95QnRLslOqisEuC7v934lHOfN05cVjbtDB', 
  access_token: '2834545563-QYQqm8hnLPiU3eFyAD8SGtKhfIYW7gMp8fGh8Xd',
  access_token_secret: 'SUquQt3XC2ve3IIa8JbwMa4bsRCpZSJuCVKYAXLUTDBBT'
});

app.use(require('cors')());
app.use(require('body-parser').json());

let cache = [];
let cacheAge = 0;

app.get('/api/tweets', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();

    const params = { count: 5, result_type: "recent", q: "#nowplaying url:youtube -filter:retweets" };
    
    if(req.query.latitude && req.query.longitude) {
      params.geocode = req.query.latitude + "," + req.query.longitude + ",100km"
    }

    client
      .get('search/tweets', params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});

app.post('/api/tweet', (req, res) => {

  let status = "";

  if(req.query.comment && req.query.videoUrl) {
    status = req.query.comment + " #NowPlaying " + req.query.videoUrl
  }

  client
    .post('statuses/update', { status: status })
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.listen(3000, () => console.log('Server running'));
