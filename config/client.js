var repos = {};
var labels = {};
var env = process.env;

function addRepo(name, key, label) {
  env[key] && (repos[name] = env[key]);
  env[key] && (labels[name] = (label || repos[name]));
}
addRepo('user-agent', 'PX_USER_AGENT', 'User Agent');
addRepo('dispatcher', 'PX_DISPATCHER', 'Dispatcher');
addRepo('platform', 'PX_PLATFORM', 'Platform');
addRepo('project-issues', 'PX_PROJECT_ISSUES', 'Project Issues');
addRepo('website', 'PX_PAGES', 'Website');

var maxDynaReposQuantity = 5;
for(i = 0; i < maxDynaReposQuantity; i++) {
  addRepo(env['REPO_' + i + '_NAME'] || i + 'th', 'REPO_' + i + '_URL');
}

if(env.REPOS) {
  var chunks = env.REPOS.split(';');
  chunks.forEach(function(chunk) {
    var val = chunk,
    nameRegex = /(https:\/\/api\.github\.com\/repos\/)?(.*)/;
    name = nameRegex.exec(val)[2],
    key = name.toLowerCase().replace('/', '_'); 

    var gitHubApiPrefix = 'https://api.github.com/repos/'; 
    repos[key] = gitHubApiPrefix + name;
    labels[key] = name;
  });
};

module.exports = {
  repos: repos,
  labels: labels
};
