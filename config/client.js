var repos = {};
var labels = {};
var env = process.env;

function addRepo(name, key, label) {
  env[key] && (repos[name] = env[key]);
  env[key] && (labels[name] = (label || repos[name]));
}
addRepo('platform', 'PX_PLATFORM', 'Platform');
addRepo('dispatcher', 'PX_DISPATCHER', 'Dispatcher');
addRepo('user-agent', 'PX_USER_AGENT', 'User Agent');
addRepo('website', 'PX_PAGES', 'Website');
addRepo('project-issues', 'PX_PROJECT_ISSUES', 'Project Issues');


for(i = 0; i < 5; i++) {
  addRepo(env['REPO_' + i + '_NAME'] || i + 'th', 'REPO_' + i + '_URL');
}

module.exports = {
  repos: repos,
  labels: labels
};
