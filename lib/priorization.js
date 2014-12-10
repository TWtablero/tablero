var redis = require("redis"),
    url = require("url"),
    client;

function setUp(app, options) {
  app.get('/priorities', retrieve);
  app.put('/priorities', update);
  app.post('/priorities', update);

  var redisUrl = url.parse(options.url);
  client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if(redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }
}

function retrieve(req, res) {
  var query = req.query;
  console.log(query.track)
  client.get("priority:" + query.track, function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply)
    res
      .send({issues: JSON.parse(reply)})
      .status(200);
  });
}

function update(req, res) {
  var body = req.body;
  console.log(req.body);
  var priorities = body.issues || [];
  client.set("priority:" + body.track, JSON.stringify(priorities));
  res
    .send({})
    .status(201);
}


module.exports = setUp;