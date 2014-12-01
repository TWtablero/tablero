var config = {};

config.repos = {
  'user-agent': process.env.PX_USER_AGENT,
  'dispatcher': process.env.PX_DISPATCHER,
  'platform': process.env.PX_PLATFORM,
  'project-issues': process.env.PX_PROJECT_ISSUES
};

module.exports = config;