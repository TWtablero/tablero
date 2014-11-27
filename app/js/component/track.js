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
        issueItemSelector: '.issue',
        issuesCount: 0
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
        this.attr.issuesCount += issues.length;

        issues.forEach(function (issue) {
          if(issue.labels[0].name != "4 - Done") {
            this.$node.prepend(this.renderIssue(issue));
          }
        }.bind(this));

        $('.panel-heading.backlog-header .issues-count').text(' (' + $('.issue-track.backlog .issue').length + ')');
        $('.panel-heading.ready-header .issues-count').text(' (' + $('.issue-track.ready .issue').length + ')');
        $('.panel-heading.development-header .issues-count').text(' (' + $('.issue-track.development .issue').length + ')');
        $('.panel-heading.quality-assurance-header .issues-count').text(' (' + $('.issue-track.quality-assurance .issue').length + ')');

        if(this.attr.trackType === "4 - Done") {
          $('.panel-heading.done .issues-count').text(' (' + this.attr.issuesCount + ')');
        }
      };

      this.cleanCount = function() {
        this.attr.issuesCount = 0;
      };

      this.moveIssue = function(movedToTrackName) {
        if(this.attr.trackType === "4 - Done") {
          this.attr.issuesCount++;
          $('.panel-heading.done .issues-count').text(' (' + this.attr.issuesCount + ')');
        }
      };

      this.renderIssue = function (issue) {
        var renderedIssue = $(this.render(issue));
        if (renderedIssue.find('.assignee-avatar').attr('src') != "" ) {
          renderedIssue.find('.assigns-myself').addClass('assigned');
          renderedIssue.find('.empty-avatar').hide();
          renderedIssue.find('.empty-avatar-label').hide();
        }
        renderedIssue.find('a.assigns-myself').click(function () {
          this.trigger('ui:assigns:user', {issue: issue});
        }.bind(this));
        return renderedIssue;
      };

      this.after('initialize', function () {
        this.on(document, 'data:issues:refreshed', this.displayIssues);
        this.on(document, 'data:issues:cleanCount', this.cleanCount);
        this.on(document, 'data:issues:issueMoved', this.moveIssue);
      });
    }
  }
);
