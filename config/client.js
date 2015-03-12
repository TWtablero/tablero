var repos = {};
var labels = {};
var nconf = require('nconf');
var configurable = require('../lib/configurable');

function addRepo(name, key, label) {
  nconf.get(key) && (repos[name] = nconf.get(key));
  nconf.get(key) && (labels[name] = (label || repos[name]));
}
addRepo('user-agent', 'PX_USER_AGENT', 'User Agent');
addRepo('dispatcher', 'PX_DISPATCHER', 'Dispatcher');
addRepo('platform', 'PX_PLATFORM', 'Platform');
addRepo('project-issues', 'PX_PROJECT_ISSUES', 'Project Issues');
addRepo('website', 'PX_PAGES', 'Website');
addRepo('project-issues', 'PX_PROJECT_ISSUES', 'Project Issues');


var maxDynaReposQuantity = 5;
for(i = 0; i < maxDynaReposQuantity; i++) {
  addRepo(nconf.get('REPO_' + i + '_NAME') || i + 'th', 'REPO_' + i + '_URL');
}

configurable.get('REPOS', function(value) {
  var chunks = value.split(';');
  chunks.forEach(function(chunk) {
    var val = chunk,
    nameRegex = /(https:\/\/api\.github\.com\/repos\/)?(.*)/;
    name = nameRegex.exec(val)[2],
    key = name.toLowerCase().replace('/', '_'); 

    var gitHubApiPrefix = 'https://api.github.com/repos/'; 
    repos[key] = gitHubApiPrefix + name;
    labels[key] = name;
  });
});

module.exports = {
  repos: repos,
  labels: labels
};
