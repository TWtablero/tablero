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
    'component/ui/issues_filter'
  ],
  function (githubUser, githubIssues, track, issuesExporter, prioritizationManager, issuesFilter) {
    'use strict';

    return initialize;

    function initialize() {
      issuesFilter.attachTo($('#filters'));

      githubIssues.attachTo(document);
      githubUser.attachTo(document);
      issuesExporter.attachTo(document);
      prioritizationManager.attachTo(document);

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

      $(document).trigger('ui:needs:issues', {});

      $("#create_issue").click(function () {
        $(document).trigger('ui:create:issue', {
          'issueTitle': $("#issueTitle").val(),
          'issueBody': $("#issueBody").val(),
          'projectName': $("#projects").val()
        });

        $("#myModal").modal('hide')
        $("#myModal input, textarea").val('')
      });

      $("#projects").change(function () {
        $(document).trigger("ui:issue:createIssuesURL", $(this).val());
      });

      $(document).trigger("ui:issue:createIssuesURL", $("#projects").val());
      $(document).trigger('ui:draggable');
      $(document).trigger('ui:needs:githubUser');
    }
  });
