var config = {};

// Set this variables on production server
config.clientId = process.env.CLIENT_ID;
config.clientSecret = process.env.CLIENT_SECRET;

config.repos = {
  'user-agent': "https://api.github.com/repos/pixelated-project/pixelated-user-agent",
  'dispatcher': "https://api.github.com/repos/pixelated-project/pixelated-dispatcher",
  'project-issues': "https://api.github.com/repos/pixelated-project/project-issues",
  'platform': "https://api.github.com/repos/pixelated-project/pixelated-platform"
};

module.exports = config;
