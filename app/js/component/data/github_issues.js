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
define(['flight/lib/component', 'component/mixins/with_auth_token_from_hash'],
  function (defineComponent, withAuthTokeFromHash) {
    return defineComponent(githubIssues, withAuthTokeFromHash);

    function githubIssues() {
      this.fetchUserAgentIssues = function () {
        return $.getJSON('https://api.github.com/repos/oliviagj/kanboard/issues?per_page=100&state=all');
      };

      this.fetchDispatcherIssues = function () {
        return $.getJSON('https://api.github.com/repos/oliviagj/kanboard/issues?per_page=100&state=all');
      };

      this.fetchPlatformIssues = function () {
        return $.getJSON('https://api.github.com/repos/oliviagj/kanboard/issues?per_page=100&state=all');
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
            var allIssues = [];
            allIssues = allIssues.concat(userAgentIssues[0].responseJSON);
            allIssues = allIssues.concat(dispatcherIssues[0].responseJSON);
            allIssues = allIssues.concat(platformIssues[0].responseJSON);

            this.trigger('data:issues:refreshed', {issues: allIssues});
          }.bind(this)
        );
      };

      this.assignMyselfToIssue = function (ev, assignData) {
        var user, issue, url;
        user = assignData.user;
        issue = assignData.issue;

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
			      $('#' + issue.id + ' > .assignee').text(user.login);
          }
        });
      };
 
      this.draggable = function (ev, data) {   
        $('.backlog, .ready, .development, .quality-assurance').sortable({
          connectWith: '.list-group',
          receive: function(event, ui) {
            var label, labels, url;

            if(!this.getCurrentAuthToken()) {
              this.trigger(document, 'ui:needs:githubUser');
              return;
            }

            url = ui.item[0].childNodes[0].href.replace('github.com/', 'api.github.com/repos/') + "?access_token=" + this.getCurrentAuthToken();
            label = this.parseLabel(event.target.id);

            $.ajax({
              type: 'PATCH',
              url: url,
              data: JSON.stringify({labels: [label]}),
              success: function (response, status, xhr) {
                console.log('Issue label  updated to ' + label);
              }
            });
          }.bind(this)
        }).disableSelection();

      $('.done').sortable({
          connectWith: '.list-group',
          receive: function(event, ui) {
            var url, label;

            if(!this.getCurrentAuthToken()) {
              this.trigger(document, 'ui:needs:githubUser');
              return;
            }
     
            url = ui.item[0].childNodes[0].href.replace('github.com/', 'api.github.com/repos/') + "?access_token=" + this.getCurrentAuthToken();
            label = this.parseLabel(event.target.id);

            $.ajax({
              type: 'PATCH',
              url: url,
              data: JSON.stringify({labels: [label], state: 'closed'}),
              success: function (response, status, xhr) {
                console.log('Issue label  updated to ' + label);
              }
            });
          }.bind(this)
        }).disableSelection();
      };

      this.parseLabel = function(label){
        var fullLabel = '';
        label = label.split('-');

        for(i = 1; i < label.length; i++) {
          var firstLetter = label[i][0];
          fullLabel = fullLabel +  firstLetter.toUpperCase() + label[i].substring(i) + ' ';
        }

        fullLabel = label[0] + ' - ' + fullLabel;
        return fullLabel.trim();   
      };	   

      this.after('initialize', function () {
        this.on('ui:needs:issues', this.fetchIssues);
        this.on('ui:assigns:user', this.assignMyselfToIssue);
        this.on('data:githubUser:here', this.assignMyselfToIssue);
        this.on('ui:draggable', this.draggable);
      });
    }
  }
);
