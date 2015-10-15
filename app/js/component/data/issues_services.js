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
define([
  'flight/lib/component',
  'component/mixins/with_auth_token_from_hash',
  'component/mixins/repositories_urls',
 ], function (defineComponent, withAuthTokeFromHash, repositoriesURLs) {
      return defineComponent(issuesServices, withAuthTokeFromHash, repositoriesURLs);

    function issuesServices() {

      this.fetchAllIssues = function (repositoryUrl, projectName, cb) {
        var MAX_WAITING_TIME = 2000;
        var DATA_TYPE = "json";
        var FIRST_PAGE = 1;

        var iterate = function(page) {
          var config = {
            dataType: DATA_TYPE,
            url: this.repoIssuesURL(repositoryUrl, page),
            timeout: MAX_WAITING_TIME
          };

          var success = function(data, status, xhr) {
            cb(data, projectName);
            if(data.length != 0) {
              iterate(++page);
            }
          };

          var failure = function() {
            this.trigger(document, 'ui:show:messageFailConnection');
          };

          $.ajax(config)
            .done(success)
            .fail(failure.bind(this));

        }.bind(this);
        iterate(FIRST_PAGE);
      };

      this.loadAndPrioritizeAllIssues = function (ev, repositories) {
          $(document).trigger('ui:blockUI');
          this.repositories = repositories;
          _.each(repositories, function (url, projectName) {
            this.fetchAllIssues(url, projectName, this.addIssuesToBoard.bind(this));
          }.bind(this));
      };

      this.addIssuesToBoard = function(issues, projectName) {
        var allIssues = this.prepareAllIssues(issues, projectName);
        this.trigger(document, 'data:issues:add', allIssues);

        this.trigger('data:issues:refreshed', {
          issues: allIssues
        });

        var projectNames = Object.keys(this.repositories);
        var projectIdentifiers = {
          projects: this.getAllProjectsIdentifiers(projectNames)
        };
          this.trigger('ui:needs:priority', projectIdentifiers);
      };

      this.prepareAllIssues = function (issues, projectName) {
        var allIssues = [];

        issues.forEach(function (issue, index) {
          if (!issue.pull_request) {
            issue.projectName = projectName;
            issue.repoUrl = this.getRepoURLFromIssue(issue.url);
            allIssues.push(issue);
          }
        }.bind(this));
        return allIssues;
      };

      this.getRepoURLFromIssue = function (issueUrl) {
        var delimeter = '/';
        var shallNotPass = '/issues/';
        if (issueUrl) {
          var result = issueUrl.substring(0, issueUrl.indexOf(shallNotPass)) + delimeter;
          return result;
        }
      };

      this.after('initialize', function () {
         this.on('ui:needs:issues', this.loadAndPrioritizeAllIssues);
      });
    };
  }
);