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
  var project = query.project;
  if(client){
    client.hgetall('priority:' + project, function(err, reply) {
      if(err) {
        console.log(err);
      }
      res
      .send({issues: reply})
      .status(200);
    });
  }
  else{
    res.send({}).status(503);
  } 

}

function update(req, res) {
  var body = req.body;
  var project = body.project;
  var issue = body.issue;
  var priority = body.priority;
  if(client){
    client.hset('priority:'  + project , issue ,priority);
    res
    .send({})
    .status(201);
  } else {
    res.send({})
    .status(503);
  }
}


module.exports = setUp;