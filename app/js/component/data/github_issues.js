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
define(['flight/lib/component', 'flight/lib/utils'],
  function (defineComponent, utils) {
    return defineComponent(githubIssues);

    function githubIssues() {
      this.fetchUserAgentIssues = function () {
        return $.getJSON('https://api.github.com/repos/pixelated-project/pixelated-user-agent/issues');
      };

      this.fetchDispatcherIssues = function () {
        return $.getJSON('https://api.github.com/repos/pixelated-project/pixelated-dispatcher/issues');
      };

      this.fetchIssues = function (ev, data) {
        this.retrievedIssues = {};
        var userAgentIssuesDeferred, dispatcherIssuesDeferred;

        userAgentIssuesDeferred = $.Deferred();
        dispatcherIssuesDeferred = $.Deferred();

        var f1 = this.fetchUserAgentIssues().complete(userAgentIssuesDeferred.resolve);
        var f2 = this.fetchDispatcherIssues().complete(dispatcherIssuesDeferred.resolve);

        $.when(userAgentIssuesDeferred, dispatcherIssuesDeferred).done(function (userAgentIssues, dispatcherIssues) {
          var allIssues = userAgentIssues[0].responseJSON.concat(dispatcherIssues[0].responseJSON);
          this.trigger(document, 'data:issues:refreshed', {issues: allIssues});
        }.bind(this));
      };

      this.after('initialize', function () {
        this.on('ui:needs:issues', this.fetchIssues);
      });
    }
  }
);
