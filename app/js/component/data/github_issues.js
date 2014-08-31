/*
 * Copyright 2014 Alexandre Pretto Nunes
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
define(['flight/lib/component'],
  function (defineComponent) {
    return defineComponent(githubIssues);

    function githubIssues() {
      this.fetchIssues = function (ev, data) {
        $.getJSON('https://api.github.com/repos/pixelated-project/pixelated-user-agent/issues', null, function(issuesData) {
          this.trigger(document, 'data:issues:refreshed', {issues: issuesData});
        }.bind(this));
      };

      this.after('initialize', function () {
        this.on('ui:needs:issues', this.fetchIssues);
      });
    }
  }
);
