var config = {};

config.repos = {
  'user-agent': process.env.PX_USER_AGENT,
  'dispatcher': process.env.PX_DISPATCHER,
  'project-issues': process.env.PX_PROJECT_ISSUES,
  'platform': process.env.PX_PLATFORM
};

module.exports = config;