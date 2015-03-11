var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var url = require('url');
var sass = require('node-sass');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var configurable = require('./lib/configurable');
var _ = require('underscore');


var bootstrap = function() {
  var configServer = require('./config/server.js');
  var configClient = require('./config/client.js');

  var oauthUrl = configServer.oauthUrl;
  var clientId = configServer.clientId;
  var clientSecret = configServer.clientSecret;

  app.use(sass.middleware({
    src: __dirname + '/app',
    debug: false
  }));

  app.use(express.static(path.join(__dirname, 'app')));

  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.use(cookieParser());

  app.get('/config', function(req, res) {
    res.send(configClient);
  });

  app.get('/request_code', function(req, res) {
    var authorizeUrl = oauthUrl + '/authorize?client_id=' + clientId;

    var access = req.query.access || req.cookies.access || 'public_repo';

    res.cookie('access', access, { expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)) } );
    res.redirect(authorizeUrl + '&scope=' + access);
  });

  app.get('/request_auth_token', function(req, res) {
    var getAuthTokenUrl = oauthUrl + '/access_token?' +
      'client_id=' + clientId +
      '&client_secret=' + clientSecret +
      '&code=' + req.query.code;

    xhr = new XMLHttpRequest();
    xhr.open('POST', getAuthTokenUrl, false);
    xhr.send();

    var fakeUrl = 'http://fake.uri/?' + xhr.responseText;
    var repositoryAccess = url.parse(fakeUrl, true).query['scope'];

    res.redirect('/?access=' + repositoryAccess + '#' + url.parse(fakeUrl, true).query['access_token']);
  });

  require('./lib/priorization')(app, {
    url: configServer.redisUrl
  });

  port = process.env.PORT || 3000;
  app.listen(port);
  console.log('Server started. Running on port', port);
}

configurable.verify([{
  key: 'PX_CLIENT_ID',
  description: "GitHub's application Client ID"
}, {
  key: 'PX_CLIENT_SECRET',
  description: "GitHub's application Client Secret"
}, {
  key: 'REPOS',
  description: 'Repositories list (optional)',
  optional: true
}], bootstrap);
