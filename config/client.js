var repos = {};
var labels = {};
var env = process.env;

function addRepo(name, key, label) {
  env[key] && (repos[name] = env[key]);
  env[key] && (labels[name] = (label || repos[name]));
}
addRepo('project-issues', 'PX_PROJECT_ISSUES', 'User Agent');
addRepo('platform', 'PX_PLATFORM', 'Dispatcher');
addRepo('dispatcher', 'PX_DISPATCHER', 'Platform');
addRepo('user-agent', 'PX_USER_AGENT', 'Project Issues');
addRepo('pages', 'PX_PAGES', 'Pages');

for(i = 0; i < 5; i++) {
  addRepo(env['REPO_' + i + '_NAME'] || i + 'th', 'REPO_' + i + '_URL');
}

module.exports = {
  repos: repos,
  labels: labels
};
