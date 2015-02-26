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
    'component/data/github_user',
    'component/data/github_issues',
    'component/track',
    'component/data/issues_exporter',
    'component/data/prioritization_manager',
    'component/ui/issues_filter',
    'component/ui/new_issue',
    'component/ui/permissions_gateway',
    'component/mixins/with_auth_token_from_hash',
    'component/ui/columns_modal',
    'component/data/columns_manager'
  ],
  function (githubUser,
            githubIssues,
            track,
            issuesExporter,
            prioritizationManager,
            issuesFilter,
            newIssue,
            permissionsGateway,
            authToken,
            columnsModal,
            columnsManager) {
    'use strict';

    return initialize;

    function initialize() {
      issuesFilter.attachTo($('#filters'));
      newIssue.attachTo('#myModal');
      permissionsGateway.attachTo('#permissionsGateway');
      columnsModal.attachTo('#columnsModal');

      $.blockUI.defaults.message = '<h2 id="loading" class="loading">Please wait...</h2>';
      $.blockUI.defaults.ignoreIfBlocked = true;
      $(document).ajaxStop($.unblockUI);

      githubIssues.attachTo(document);
      githubUser.attachTo(document);
      issuesExporter.attachTo(document);
      prioritizationManager.attachTo(document);
      columnsManager.attachTo(document);

      track.attachTo('.issue-track.backlog', {
        trackType: '0 - Backlog'
      });
      track.attachTo('.issue-track.ready', {
        trackType: '1 - Ready'
      });
      track.attachTo('.issue-track.development', {
        trackType: '2 - Development'
      });
      track.attachTo('.issue-track.quality-assurance', {
        trackType: '3 - Quality Assurance'
      });
      track.attachTo('.issue-track.done', {
        trackType: '4 - Done'
      });

      $('.backlog-column .hide-icon').first().click(function() {
        $('.backlog-column').toggle('slide');
        $('.backlog-sidebar').toggle('slide');
      });
      $('.backlog-sidebar .hide-icon-sidebar').first().click(function() {
        $('.backlog-column').toggle('slide');
        $('.backlog-sidebar').toggle('slide');
      });

      var mountBoard = function(){
        $(document).trigger('ui:needs:issues', {});
        $(document).trigger("ui:issue:createIssuesURL", $("#projects").val());
        $(document).trigger('ui:draggable');
      };

      $(document).trigger('ui:needs:githubUser', { callback : mountBoard });


      $(document).on('ui:show:messageFailConnection', function(event){
        $.unblockUI();
        $('#failConnectionModal').modal('toggle');
      });

      $('#redirectToPublicBtn').click(function(){
        var token = window.location.hash.slice(1);

        window.location = '/?access=repo#'+token;
      }.bind(this));
    }
  });

