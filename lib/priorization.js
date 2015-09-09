var redis = require("redis"),
  url = require("url"),
  _ = require('underscore'),
  client;

function setUp(app, options) {
  app.get('/priorities', retrieve);
  app.put('/priorities', update);
  app.post('/priorities', update);

  var redisUrl = url.parse(options.url);

  options = {}
  if (redisUrl.auth) options.auth_pass = redisUrl.auth.split(":")[1]
  client = redis.createClient(redisUrl.port, redisUrl.hostname, options);

  client.on('error', function (event) {

    if (client) {
      console.error('[ERROR] Could NOT connect to Redis server');
    }
    client = undefined;

  });

}

function retrieve(req, res) {
  var query = req.query;
  var project = query.project;

  if (client) {
    client.hgetall('priority:' + project, function (err, reply) {
      var answer = [];
      if (err) {
        console.log('[ERROR] Error while retrieving priorities: ' + err);
      }
      if (reply) {
        _.each(_.pairs(reply), function (value, key, list) {
          answer.push({
            id: value[0],
            priority: value[1]
          });
        });
      }
      res
        .send({
          issues: answer
        })
        .status(200);
    });
  } else {
    res.send({}).status(503);
  }

}

function update(req, res) {
  var body = req.body;
  var project = body.project;
  var issue = body.issue;
  var priority = body.priority;
  if (client) {
    client.hset('priority:' + project, issue, priority);
    res
      .send({})
      .status(201);
  } else {
    res.send({})
      .status(503);
  }
}


module.exports = setUp;
