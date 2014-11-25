var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var url = require('url');
var sass = require('node-sass');
var app = express();
var configServer = require('./config_server.js');
var config = require('./config.js');

app.use(sass.middleware({
  src: __dirname + '/app',
  debug: true
}));

app.use(express.static('app'));

app.get('/config', function (req, res) {
  res.send(config);
});

app.get('/request_code', function (req, res) {
  res.redirect('https://github.com/login/oauth/authorize?client_id=' + configServer.clientId + '&scope=public_repo');
});

app.get('/request_auth_token', function (req, res) {
  console.log('==== /request_auth_token ====');
  var getAuthTokenUrl = 'https://github.com/login/oauth/access_token?' +
    'client_id=' + configServer.clientId +
    '&client_secret=' + configServer.clientSecret +
    '&code=' + req.query.code;

  xhr = new XMLHttpRequest();
  xhr.open('POST', getAuthTokenUrl, false);
  xhr.send();

  var fakeUrl = 'http://fake.uri/?' + xhr.responseText;
  console.log('got auth token: ');
  console.log(url.parse(fakeUrl, true));

  res.redirect('/#' + url.parse(fakeUrl, true).query['access_token']);
});

port = process.env.PORT || 3000;
app.listen(port);
console.log('Server started. Running on port', port);
