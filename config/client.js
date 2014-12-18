var repos = {};
var env = process.env;

function addRepo(name, key) {
  env[key] && (repos[name] = env[key]);
}
addRepo('user-agent', 'PX_USER_AGENT');
addRepo('dispatcher', 'PX_DISPATCHER');
addRepo('platform', 'PX_PLATFORM');
addRepo('project-issues', 'PX_PROJECT_ISSUES');
addRepo('pages', 'PX_PAGES');

module.exports = {repos: repos};
