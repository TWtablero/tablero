/*
* Copyright 2014 Thoughtworks Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
define(['config/config_bootstrap'],
function (config) {
  return issueFilterTemplate;

  function issueFilterTemplate() {
    var repoNames = config.getReposNames();
    this.getRepoColor = function (projectName) {
      var idx = repoNames.indexOf(projectName);
      return 'color' + idx;
    };

    this.renderFilter = function (repo) {
      repo.colorClass = this.getRepoColor(repo.name);
      var renderedIssue = this.template.render(repo);
      return renderedIssue;
    };

    this.before('initialize', function () {
      this.template = Hogan.compile(
        '<span class="filter-repo">' +
          '<input type="checkbox" id="repository-{{index}}" checked="true" repo="{{name}}">' +
          '<label for="repository-{{index}}"><i class=" icon-eye-open {{colorClass}}"></i> {{name}}</label>' +
        '</span>'
      );
    });
  }
}
);
