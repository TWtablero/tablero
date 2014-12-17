var configServer = {};

configServer.clientId = process.env.PX_CLIENT_ID;
configServer.clientSecret = process.env.PX_CLIENT_SECRET;
configServer.redisUrl = process.env.REDISCLOUD_URL || 'redis://localhost:6379'


module.exports = configServer;