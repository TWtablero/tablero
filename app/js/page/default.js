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
    'component/track'
  ],
  function (githubUser, githubIssues, track) {
  'use strict';

  return initialize;

  function initialize() {
    githubIssues.attachTo(document);
    githubUser.attachTo(document);

    track.attachTo('.issue-track.backlog', {trackType: '0 - Backlog'});
    track.attachTo('.issue-track.ready', {trackType: '1 - Ready'});
    track.attachTo('.issue-track.development', {trackType: '2 - Development'});
    track.attachTo('.issue-track.quality-assurance', {trackType: '3 - Quality Assurance'});
    track.attachTo('.issue-track.done', {trackType: '4 - Done'});

    $(document).trigger('ui:needs:issues', {projectName: 'all' });

    function triggerRocketAnimation() {
        $(".panel-heading.done img.plain").hide();
        $(".panel-heading.done img.colored").show().animate({
          top: '-1000px'
        }, 2000, 'easeInQuart', function() { 
          $(".panel-heading.done img.colored").hide().css('top', 0);
          $(".panel-heading.done img.plain").fadeIn("slow");
        });
      }

    $("#create_issue").click(function() {
      $(document).trigger('ui:create:issue',
        { 'issueTitle': $("#issueTitle").val(),
          'issueBody':  $("#issueBody").val(),
          'projectName': $("#projects").val() });

      $("#myModal").modal('hide')
      $("#myModal input, textarea").val('')
    });

    $(".panel-heading.done img.plain").click(function () {
      triggerRocketAnimation();
    });

    $("#filter-repo").change(function() {
      $('.issue').remove();

      if ($(this).val() == 'All repositories') {
        $(document).trigger('ui:needs:issues', {projectName: 'all' });
      } else {
        $(document).trigger('ui:needs:issues', {projectName: $(this).val()});
      }
    });

    $(document).trigger('ui:draggable');
    $(document).trigger('ui:needs:githubUser');
  }
});
