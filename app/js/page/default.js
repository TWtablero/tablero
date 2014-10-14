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
    'component/data/issues_exporter'
  ],
  function (githubUser, githubIssues, track, issuesExporter) {
  'use strict';

  return initialize;

  function initialize() {
    githubIssues.attachTo(document);
    githubUser.attachTo(document);
    issuesExporter.attachTo(document);

    track.attachTo('.issue-track.backlog', {trackType: '0 - Backlog'});
    track.attachTo('.issue-track.ready', {trackType: '1 - Ready'});
    track.attachTo('.issue-track.development', {trackType: '2 - Development'});
    track.attachTo('.issue-track.quality-assurance', {trackType: '3 - Quality Assurance'});
    track.attachTo('.issue-track.done', {trackType: '4 - Done'});

    $(document).trigger('ui:needs:issues', {projectName: 'all' });

    function triggerRocketAnimation() {
        $(".panel-heading.done img.plain").hide();
        $(".panel-heading.done h3").css('opacity', 0);
        $(".panel-heading.done .issues-count").css('opacity', 0);
        $(".panel-heading.done img.colored").show().animate({
          top: '-650px'
        }, 2000, 'easeInBack', function() { 
          $(".panel-heading.done img.colored").hide().css('top', 0);
          
          $(".panel-heading.done h3").text('Liftoff! We Have a Liftoff!');
          $(".panel-heading.done h3").css('color', '#5dc66c');
          $(".panel-heading.done h3").animate({
            opacity: 1
          }, 2000);

          $(".panel-heading.done .check-done").fadeIn(2000, function() {
            $(".panel-heading.done .check-done").hide();

            $(".panel-heading.done h3").css('opacity', 0);
            $(".panel-heading.done h3").text('Drop here to launch');
            $(".panel-heading.done h3").css('color', '#aaa');

            $(".panel-heading.done img.plain").fadeIn(600);
            $(".panel-heading.done h3").animate({
              opacity: 1
            }, 600);
            $(".panel-heading.done .issues-count").animate({
              opacity: 1
            }, 600);
          });
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

    $(".done").on( "sortreceive", function(event, ui) {
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

    $("#projects").change(function(){
      $(document).trigger("ui:issue:createIssuesURL", $(this).val());
    });

    $(document).trigger("ui:issue:createIssuesURL", $("#projects").val());
    $(document).trigger('ui:draggable');
    $(document).trigger('ui:needs:githubUser');
  }
});
