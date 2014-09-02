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
define(
  [
    'flight/lib/component',
    'component/templates/issue_template'
  ],
  function (defineComponent, withIssueTemplate) {
    return defineComponent(track, withIssueTemplate);

    function track() {
      this.defaultAttrs({
        issueItemSelector: '.issue'
      });

      this.isIssueOnThisTrack = function (issue) {
        return issue.labels[0].name === this.attr.trackType;
      };

      this.filterAndReorderIssues = function (issues) {
        var filteredIssues;
        filteredIssues = _.filter(issues, this.isIssueOnThisTrack, this);
        return _.sortBy(filteredIssues, function (issue) {
          var match;
          var regexp = /@huboard:{.*"order":([0-9e.-]+).*}/;
          if (match = regexp.exec(issue.body)) {
            return Number(match[1] || 0);
          }
          return 0;
        });
      };

      this.displayIssues = function (ev, data) {
        var issues = this.filterAndReorderIssues(data.issues);
        issues.forEach(function (issue) {
          this.$node.append(this.renderIssue(issue));
        }.bind(this));
      };

      this.renderIssue = function (issue) {
        var renderedIssue = $(this.render(issue));
        renderedIssue.find('.assigns-myself').on('click', function () {
          this.trigger('ui:updates:assignee', {issue: issue});
        }.bind(this));
        return renderedIssue;
      };

      this.willUpdateAssignee = function (ev, issueData) {
        this.trigger('ui:needs:githubUser', issueData);
      };

      this.updateAssignee = function (ev, updateData) {
        this.trigger('ui:assigns:user', updateData);
      };

      this.after('initialize', function () {
        this.on(document, 'data:issues:refreshed', this.displayIssues);
        this.on('ui:updates:assignee', this.willUpdateAssignee);
        this.on('data:githubUser:here', this.updateAssignee);
      });
    }
  }
);
