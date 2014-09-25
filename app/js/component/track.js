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
        return issue.labels[0] != undefined && issue.labels[0].name === this.attr.trackType;
      };

      this.filterAndReorderIssues = function (issues) {
        var filteredIssues;
        filteredIssues = _.filter(issues, this.isIssueOnThisTrack, this);
        this.attr.issues = filteredIssues;

        return _.sortBy(filteredIssues.reverse(), function (issue) { issue.number });
      };

      this.displayIssues = function (ev, data) {
        var issues = this.filterAndReorderIssues(data.issues);
        issues.forEach(function (issue) {
          this.$node.prepend(this.renderIssue(issue));
        }.bind(this));
      };

      this.renderIssue = function (issue) {
        var renderedIssue = $(this.render(issue));
        if (renderedIssue.find('.assignee-avatar').attr('src') != "" ) {
          renderedIssue.find('.empty-avatar').hide();
        }
        renderedIssue.find('a.assigns-myself').click(function () {
          this.trigger('ui:assigns:user', {issue: issue});
        }.bind(this));
        return renderedIssue;
      };

      this.after('initialize', function () {
        this.on(document, 'data:issues:refreshed', this.displayIssues);
      });
    }
  }
);
