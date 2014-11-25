var config = {};

config.clientId = process.env.PX_CLIENT_ID || "1c798ee6e4fb306fd077";
config.clientSecret = process.env.PX_CLIENT_SECRET || "16d942571dcf5e59a81e53072b40d7260991d489";


config.repos = {
  'user-agent': "https://api.github.com/repos/pixelated-project/pixelated-user-agent",
  'dispatcher': "https://api.github.com/repos/pixelated-project/pixelated-dispatcher",
  'project-issues': "https://api.github.com/repos/pixelated-project/project-issues",
  'platform': "https://api.github.com/repos/pixelated-project/pixelated-platform"
};

module.exports = config;