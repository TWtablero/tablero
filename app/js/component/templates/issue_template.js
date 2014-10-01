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
define([],
  function (template, compiler) {
    return issueTemplate;

    function issueTemplate() {
      this.getRepoName = function (issue) {
        var repoNameRegExp = /pixelated-project\/(pixelated-[a-z-]+)/;
        return repoNameRegExp.exec(issue.url)[1];
      };

      this.clearHuboardInfo = function (issue) {
        var clearedIssue, issueParts;
        clearedIssue = _.clone(issue);

        clearedIssue.body = issue.body.slice(0, issue.body.indexOf("<!---")-2);

        return clearedIssue;
      }

      this.removeColumnsLabels = function(labels) {
        return _.filter(labels, function(label) {
          return !(label.name.match(/\d+ - \w+/));
        });
      }

      this.render = function (issue) {
        var renderedIssue;
        issue.repoName = this.getRepoName(issue);
        issue.labelsName = this.removeColumnsLabels(issue.labels);
        renderedIssue = this.template.render(this.clearHuboardInfo(issue));
        return renderedIssue;
      };

      this.before('initialize', function () {
        this.template = Hogan.compile(
          '<div class="issue list-group-item {{repoName}}" id="{{id}}">' +
            '<div class="issue-header">'+
              '<a class="assigns-myself">' +
                '<img class="empty-avatar" src="/img/avatar-empty.png" />' +
                '<img class="assignee-avatar" title="{{assignee.login}}" src="{{assignee.avatar_url}}" />' +
              '</a>' +
              '{{#labelsName}}' +
                '<br/>' +
                '<span>{{name}}</span>' +
              '{{/labelsName}}' +
              '<a href="{{html_url}}" target="_blank"><span class="issue-number right">#{{number}}</span></a>' +
            '</div>' +
            '<div class="issue-body"><a class="title list-group-item-heading" href="{{html_url}}" target="_blank" data-toggle="tooltip" title="{{body}}">' +
              '{{title}}' +
            '</a></div>' +
          '</div>'
        );
      });
    }
  }
);
