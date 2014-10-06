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
define(['flight/lib/component', 'component/mixins/with_auth_token_from_hash', 'component/mixins/repositories_urls'],
  function (defineComponent, withAuthTokeFromHash, repositoriesURLs) {
    return defineComponent(githubIssues, withAuthTokeFromHash, repositoriesURLs);

    function githubIssues() {
      this.fetchUserAgentIssues = function () {
        return $.getJSON(this.repoIssuesURL(this.userAgentRepoURL));
      };

      this.fetchDispatcherIssues = function () {
        return $.getJSON(this.repoIssuesURL(this.dispatcherRepoURL));
      };

      this.fetchPlatformIssues = function () {
        return $.getJSON(this.repoIssuesURL(this.platformRepoURL));
      };

      this.createIssue = function (ev, data) {
        var url, repositoryURL;
        repositoryURL = this.getURLFromProject(data.projectName);
        url = this.repoIssuesURL(repositoryURL);

        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify({'title': data.issueTitle,
                                'body': data.issueBody,
                                'labels': ["0 - Backlog"] }),
          success: function (response, status, xhr) {
            this.trigger("ui:add:issue", {"issue": response})
          }.bind(this)
        });
      };

      this.addIssue = function (ev, data) {
        this.trigger('data:issues:refreshed', {issues: data});
      }

      this.filterProjectsByName = function (projects, projectName){
        return _.filter(projects, function(project) {
          return project.projectName == projectName || projectName == 'all'
        });
      };

      this.getIssuesFromProjects = function (projects) {
        var allIssues = [];

        _.each(projects, function(project) {
          allIssues = allIssues.concat(project.repo[0].responseJSON);
        });

        return allIssues;
      };

      this.fetchIssues = function (ev, data) {
        var userAgentIssuesDeferred, dispatcherIssuesDeferred, platformIssuesDeferred;

        userAgentIssuesDeferred = $.Deferred();
        dispatcherIssuesDeferred = $.Deferred();
        platformIssuesDeferred = $.Deferred();

        this.fetchUserAgentIssues().complete(userAgentIssuesDeferred.resolve);
        this.fetchDispatcherIssues().complete(dispatcherIssuesDeferred.resolve);
        this.fetchPlatformIssues().complete(platformIssuesDeferred.resolve);

        $.when(userAgentIssuesDeferred, dispatcherIssuesDeferred, platformIssuesDeferred).done(
          function (userAgentIssues, dispatcherIssues, platformIssues) {
            var projects = [{'projectName': 'pixelated-user-agent', 'repo': userAgentIssues},
              {'projectName': 'pixelated-dispatcher', 'repo': dispatcherIssues},
              {'projectName': 'pixelated-platform', 'repo': platformIssues}],

            filteredProjects = this.filterProjectsByName(projects, data.projectName);
            issuesFromProjects = this.getIssuesFromProjects(filteredProjects);

            this.trigger('data:issues:refreshed', {issues: issuesFromProjects });
          }.bind(this)
        );
      };

      this.assignMyselfToIssue = function (ev, assignData) {
        var user, issue, url;
        if (assignData != undefined) {
          user = assignData.user;
          issue = assignData.issue;
        }

        if (!issue) {
          return;
        }

        if (!user) {
          this.trigger(document, 'ui:needs:githubUser', assignData);
          return;
        }

        url = issue.url + "?access_token=" + this.getCurrentAuthToken();

        $.ajax({
          type: 'PATCH',
          url: url,
          data: JSON.stringify({assignee: user.login}),
          success: function (response, status, xhr) {
            console.log('User ' + user.id + ' assigned to issue ' + issue.title);
            $('#' + issue.id + ' .assignee-avatar').attr('src', user.avatar_url);
            $('#' + issue.id + ' .assignee-avatar').attr('title', user.login);
            $('#' + issue.id + ' .empty-avatar').hide();
            $('#' + issue.id + ' .empty-avatar-label').hide();
            $('#' + issue.id + ' .empty-label').hide();
          }
        });
      };

      this.draggable = function (ev, data) {
        $('.backlog, .ready, .development, .quality-assurance, .done').sortable({
          connectWith: '.list-group',
          receive: function(event, ui) {
            var label, url;

            if(!this.getCurrentAuthToken()) {
              this.trigger(document, 'ui:needs:githubUser');
              return;
            }

            url = this.getIssueUrlFromDraggable(ui);
            label = this.parseLabel(event.target.id);
            state = this.getState(event.target.className);

            $('.panel-heading.backlog .issues-count').text(' (' + $('.issue-track.backlog .issue').length + ')');
            $('.panel-heading.ready .issues-count').text(' (' + $('.issue-track.ready .issue').length + ')');
            $('.panel-heading.development .issues-count').text(' (' + $('.issue-track.development .issue').length + ')');
            $('.panel-heading.quality-assurance .issues-count').text(' (' + $('.issue-track.quality-assurance .issue').length + ')');
            $('.panel-heading.done .issues-count').text(' (' + $('.issue-track.done .issue').length + ')');

            if (label == "4 - Done") {
              this.triggerRocketAnimation();
            }

            $.ajax({
              type: 'PATCH',
              url: url,
              data: JSON.stringify({labels: [label], state: state}),
              success: function (response, status, xhr) {
                console.log('Issue label  updated to ' + label);
              }
            });
          }.bind(this)
        }).disableSelection();
      };

      this.triggerRocketAnimation = function() {
        $(".panel-heading.done img.plain").hide();
        $(".panel-heading.done img.colored").show().animate({
          top: '-1000px'
        }, 2000, 'easeInQuart', function() { 
          $(".panel-heading.done img.colored").hide().css('top', 0);
          $(".panel-heading.done img.plain").fadeIn("slow");
        });
      }

      this.parseLabel = function(label){
        var fullLabel = '';
        label = label.split('-');

        for(i = 1; i < label.length; i++) {
          var firstLetter = label[i][0];
          fullLabel = fullLabel +  firstLetter.toUpperCase() + label[i].substring(1) + ' ';
        }

        fullLabel = label[0] + ' - ' + fullLabel;
        return fullLabel.trim();
      };

      this.getIssueUrlFromDraggable = function(ui) {
        return ui.item[0].childNodes[0].childNodes[1].href.replace('github.com/', 'api.github.com/repos/') + "?access_token=" + this.getCurrentAuthToken();
      };

      this.getState = function(className) {
        return className.search('done') != -1 ? 'closed' : 'open';
      };

      this.after('initialize', function () {
        this.on('ui:needs:issues', this.fetchIssues);
        this.on('ui:add:issue', this.addIssue);
        this.on('ui:create:issue', this.createIssue);
        this.on('ui:assigns:user', this.assignMyselfToIssue);
        this.on('data:githubUser:here', this.assignMyselfToIssue);
        this.on('ui:draggable', this.draggable);
      });
    }
  }
);
