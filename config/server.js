var configurable = require('../lib/configurable');
var configServer = {};

configServer.clientId = configurable.get('PX_CLIENT_ID');
configServer.clientSecret = configurable.get('PX_CLIENT_SECRET');
configServer.redisUrl = process.env.REDISCLOUD_URL || 'redis://localhost:6379'


module.exports = configServer;
