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

      this.render = function (issue) {
        var renderedIssue;
        issue.repoName = this.getRepoName(issue);
        renderedIssue = this.template.render(this.clearHuboardInfo(issue));
        return renderedIssue;
      };

      this.before('initialize', function () {
        this.template = Hogan.compile(
          '<div class="issue list-group-item {{repoName}}" id="{{id}}">' +
            '<a href="{{html_url}}" target="_blank" data-toggle="tooltip" title="{{body}}">' +
              '<h4 class="title list-group-item-heading">{{title}}</h4>' +
            '</a>' +
            '<span class="assignee">{{assignee.login}}&nbsp;</span>' +
            '<span class="label label-default issue-number">{{number}}</span>' +
            '<a class="assigns-myself btn btn-success btn-xs">Assign me</a>' +
          '</div>' 
        );
      });
    }
  }
);
