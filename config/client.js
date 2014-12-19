var repos = {};
var env = process.env;

function addRepo(name, key) {
  env[key] && (repos[name] = env[key]);
}
addRepo('project-issues', 'PX_PROJECT_ISSUES');
addRepo('platform', 'PX_PLATFORM');
addRepo('dispatcher', 'PX_DISPATCHER');
addRepo('user-agent', 'PX_USER_AGENT');
addRepo('pages', 'PX_PAGES');

for(i = 0; i < 5; i++) {
  addRepo(env['REPO_' + i + '_NAME'] || i + 'th', 'REPO_' + i + '_URL');
}

module.exports = {repos: repos};
