const express = require('express');
const Twitter = require('twit');

const app = express();
const client = new Twitter({
  consumer_key: 'CXVNsTDohsJaIxl0cjpuLKXYr',
  consumer_secret: 'Y49dNi2NPN9vJaPS95QnRLslOqisEuC7v934lHOfN05cVjbtDB', 
  app_only_auth: true
});

app.use(require('cors')());
app.use(require('body-parser').json());

let cache = [];
let cacheAge = 0;

app.get('/api/tweets', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = { count: 5, result_type: "recent", q: "#nowplaying" };
    
    params.since_id = req.query.since;
    
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

app.listen(3000, () => console.log('Server running'));
