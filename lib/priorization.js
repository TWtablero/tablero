var redis = require("redis"),
url = require("url"),
client;

function setUp(app, options) {
  app.get('/priorities', retrieve);
  app.put('/priorities', update);
  app.post('/priorities', update);

  
    var redisUrl = url.parse(options.url);
    client = redis.createClient(redisUrl.port, redisUrl.hostname);

    client.on('error', function(event) {
      
      console.log('fail in connect with redis');
      client = undefined;

    });

    if(redisUrl.auth) {
      client.auth(redisUrl.auth.split(":")[1]);
    }
  
}

function retrieve(req, res) {
  var query = req.query;
  console.log(query.track)
  if(client){
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
  else{
    res.send({}).status(503);
  } 

}

function update(req, res) {
  var body = req.body;
  console.log(req.body);
  var priorities = body.issues || [];
  if(client){
    client.set("priority:" + body.track, JSON.stringify(priorities));
    res
    .send({})
    .status(201);
  } else {
    res.send({})
    .status(503);
  }
}


module.exports = setUp;