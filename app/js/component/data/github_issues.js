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
 define([
  'flight/lib/component',
  'component/mixins/with_auth_token_from_hash',
  'component/mixins/repositories_urls',
  'component/templates/popover_template'
  ],
  function (defineComponent, withAuthTokeFromHash, repositoriesURLs, withPopoverTemplate) {
    return defineComponent(githubIssues, withAuthTokeFromHash, repositoriesURLs, withPopoverTemplate);

    function githubIssues() {

      this.defaultAttrs({
        issues : [],
      });


      this.createIssue = function (ev, data) {
        var url, repositoryURL;
        repositoryURL = this.getURLFromProject(data.projectName);
        url = this.repoIssuesURL(repositoryURL);

        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify({
            'title': data.issueTitle,
            'body': data.issueBody,
            'labels': ["0 - Backlog"]
          }),
          success: function (response, status, xhr) {
            response.projectName = data.projectName;
            this.trigger("ui:add:issue", {
              "issue": response
            })
          }.bind(this)
        });


      };

      this.addIssue = function (ev, data) {
        this.trigger('data:issues:refreshed', {
          issues: data
        });
      };

      this.filterProjectsByName = function (projects, projectNames) {
        if(! projectNames) {
         return projects;
       }

       var filteredRepos = [];

       _.each(projects, function (project) {
        if ($.inArray(project.projectName, projectNames) > -1) {
          filteredRepos.push(project);
        }
      });

       return filteredRepos;
     };

     this.getIssuesFromProjects = function (projects) {
      var allIssues = [];

      _.each(projects, function(project,index) {
        var issuesArrayJson = project.repo[0] || [];
        
        _.each(issuesArrayJson, function(issue,index) {
          issue.projectName = project.projectName;
          issue.repoUrl = this.getRepoURLFromIssue(issue.url);
          allIssues.push(issue);
        }.bind(this));
        
      }.bind(this));
      return allIssues;
    };

    this.getRepoURLFromIssue = function(issueUrl){
      var delimeter = '/';
      if(issueUrl){
        var result = issueUrl.split(delimeter).reverse().slice(2).reverse().join(delimeter) + delimeter;
        return result;
      }
    };

    this.fetchIssues = function (ev, data) {
      $(document).trigger('ui:blockUI');



      data.page = ('page' in data) ? (data.page + 1) : 1;

      var issuesPromises = this.fetchAllIssues(data.page, this.attr.blockedRepos);
      var queries = _(issuesPromises).map(function(v,k) {return v;});
      var names = _(issuesPromises).map(function(v,k) {return k;});
      $.when.apply(this, queries).done(
        function () {
          var issuesResults = arguments;
          var projects = _(names).map(function(name, idx) {
            return {
              'projectName': name,
              'repo': issuesResults[idx]
            }
          });

          var filteredProjects = this.filterProjectsByName(projects, data.projectName),
          issuesFromProjects = this.getIssuesFromProjects(filteredProjects);

          this.trigger('data:issues:refreshed', {
            issues: issuesFromProjects
          });

          this.attr.issues = this.attr.issues.concat(issuesFromProjects);

          if (data.page == 1) {
            this.trigger('data:issues:clearExportCsvLink');
          }

          if (issuesFromProjects.length > 0) {
           this.trigger('ui:needs:issues', data);
         } else {
          var projectIdentifiers =  { projects :  this.getAllProjectsIdentifiers( _.map(filteredProjects, function(proj) { return proj.projectName;  }))};
          this.trigger('ui:needs:priority', projectIdentifiers);
        }
      }.bind(this)
      );
};

    this.assignMyselfToIssue = function (ev,assignData) {

      var user, issue, url;
      if (assignData != undefined) {
        user = assignData.user;
        issue = assignData.issue;
      }

      if (!issue) {
        return;
      }

      if (!user) {
        this.trigger(document, 'ui:needs:githubUser', { data: assignData, callback : this.assignMyselfToIssue , context: this} );
        return;
      }

      if (!$('#' + issue.id + ' .empty-avatar').is(':visible')) {
        var userLogin = $('#'+ issue.id + ' .assignee-avatar').attr('title');
        if (userLogin == user.login) {
          this.trigger(document, 'ui:unassign:user', assignData);
        }
        else {
          var issue_header = $('#' + issue.id + ' .issue-header');
          if (issue_header.children('.popover').length) {
            issue_header.children('.popover').remove();
          }
          else {
            var that = this,

            popover_confirm = $('<div class="popover-confirm"></div>'),
            popover_confirm_yes = $('<button type="button" class="btn btn-default">Unassign</button>'),
            popover_confirm_no = $('<button type="button" class="btn btn-default">Cancel</button>'),
            pop = $(that.popover({
              title: '', body: ''
            })).appendTo(issue_header);

            popover_confirm_yes.bind('click', function(){
              that.trigger(document, 'ui:unassign:user', assignData);
              pop.remove();
            }).appendTo(popover_confirm);
            popover_confirm_no.bind('click', function(){
              pop.remove();
            }).appendTo(popover_confirm);

            pop.children('.popover-header').children('h2').html("Assignee: <strong>" + userLogin + "</strong>");
            popover_confirm.appendTo(pop.children('.popover-body'));
          }
        }
        return;
      }

      url = issue.url + "?access_token=" + this.getCurrentAuthToken();

      $('#' + issue.id + ' .empty-avatar').toggleClass('loading');
      $('#' + issue.id + ' .empty-avatar-label').hide();

      $.ajax({
        type: 'PATCH',
        url: url,
        data: JSON.stringify({
          assignee: user.login
        }),
        success: function (response, status, xhr) {
          $('#' + issue.id + ' .assigns-myself').toggleClass('assigned');
          $('#' + issue.id + ' .assignee-avatar').attr('src', user.avatar_url);
          $('#' + issue.id + ' .assignee-avatar').attr('title', user.login);
          $('#' + issue.id + ' .assignee-avatar').show();
          $('#' + issue.id + ' .empty-avatar').toggleClass('loading').hide();
          $('#' + issue.id + ' .empty-label').hide();
        },
        error: function() {
          $('#' + issue.id + ' .empty-avatar').toggleClass('loading').hide();
          $('#' + issue.id + ' .empty-avatar-label').show();
        }
      });
    };

    this.unassignMyselfToIssue = function(ev,assignData) {
      var user, issue, url, currentData;
      if (assignData != undefined) {
        user = assignData.user;
        issue = assignData.issue;
      }

      if (!issue) {
        return;
      }

      if (!user) {
        this.trigger(document, 'ui:needs:githubUser', { data: assignData, callback : this.assignMyselfToIssue , context: this});
        return;
      }

      url = issue.url + "?access_token=" + this.getCurrentAuthToken();

      currentData = {
        src: $('#' + issue.id + ' .assignee-avatar').attr('src'),
        title: $('#' + issue.id + ' .assignee-avatar').attr('title')
      };

      $('#' + issue.id + ' .assignee-avatar').attr('src', '/img/ajax-loader.gif');
      $('#' + issue.id + ' .assignee-avatar').attr('title', 'loading...');

      $.ajax({
        type: 'PATCH',
        url: url,
        data: JSON.stringify({
          assignee: ''
        }),
        success: function (response, status, xhr) {
          $('#' + issue.id + ' .assigns-myself').toggleClass('assigned');
          $('#' + issue.id + ' .assignee-avatar').attr('src', '').hide();
          $('#' + issue.id + ' .assignee-avatar').attr('title', '').hide();
          $('#' + issue.id + ' .empty-avatar').show();
          $('#' + issue.id + ' .empty-avatar-label').show();
          $('#' + issue.id + ' .empty-label').show();
        },
        error: function() {
          $('#' + issue.id + ' .assignee-avatar').attr('src', currentData.src);
          $('#' + issue.id + ' .assignee-avatar').attr('title', currentData.title);
        }
      });
    };


    this.updateDraggable = function(event, ui){

      var label = this.parseLabel(event.target.id);

      var issueMovedParam = {
        label : label ,
        element : this.DOMObjectToIssueMovedParam(ui.item[0]),
        previousElement : this.DOMObjectToIssueMovedParam(ui.item[0].previousElementSibling),
        nextElement : this.DOMObjectToIssueMovedParam(ui.item[0].nextElementSibling)
      };

      this.trigger(document, 'data:issues:issueMoved' , issueMovedParam);
    };

    this.draggable = function (ev, data) {
      $('.backlog, .ready, .development, .quality-assurance, .done').sortable({
        items: '.issue',
        connectWith: '.list-group',
        cancel: '.popover',
        update : this.updateDraggable.bind(this),
        receive: function (event, ui) {
          var label, url , oldLabel, state;

          if (!this.getCurrentAuthToken()) {
            this.trigger(document, 'ui:needs:githubUser');
            return;
          }



          url = this.getIssueUrlFromDraggable(ui);
          label = this.parseLabel(event.target.id);
          oldLabel = this.parseLabel(ui.sender[0].id);
          state = this.getState(event.target.className);

          $('.panel-heading.backlog-header .issues-count').text(' (' + $('.issue-track.backlog .issue').length + ')');
          $('.panel-heading.ready-header .issues-count').text(' (' + $('.issue-track.ready .issue').length + ')');
          $('.panel-heading.development-header .issues-count').text(' (' + $('.issue-track.development .issue').length + ')');
          $('.panel-heading.quality-assurance-header .issues-count').text(' (' + $('.issue-track.quality-assurance .issue').length + ')');



          if (label == "4 - Done") {
            this.triggerRocketAnimation();
            $.ajax({
              type: 'PATCH',
              url: url + this.getAccessTokenParam(),
              data: JSON.stringify({
                state: "closed"
              })
            });
          }

          $.ajax({
            type: 'POST',
            url: url + "/labels" + this.getAccessTokenParam(),
            data: JSON.stringify([label])
          });

          $.ajax({
            type: 'DELETE',
            url: url + "/labels/" + oldLabel + this.getAccessTokenParam()
          });
        }.bind(this)
      }).disableSelection();
};

this.triggerRocketAnimation = function () {
  $(".panel-heading.done img.plain").hide();
  $(".panel-heading.done h3").css('opacity', 0);
  $(".panel-heading.done .issues-count").css('opacity', 0);
  $(".panel-heading.done img.colored").show().animate({
    top: '-650px'
  }, 2000, 'easeInBack', function () {
    $(".panel-heading.done img.colored").hide().css('top', 0);

    $(".panel-heading.done h3").text('Liftoff! We Have a Liftoff!');
    $(".panel-heading.done h3").css('color', '#5dc66c');
    $(".panel-heading.done h3").animate({
      opacity: 1
    }, 2000);

    $(".panel-heading.done .check-done").fadeIn(2000, function () {
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
};

this.DOMObjectToIssueMovedParam = function(element) {
     var returnObject = { id : 0 , priority : 0 };
        if(element && element.id){
          returnObject.id = element.id;
          returnObject.priority = element.dataset.priority;
        }
        var projectUrl =  $(element).find('.issue-header a')[1];
        if(projectUrl){
          returnObject.project =  this.getProjectIdentifier(projectUrl.href) || '';
        }
        return returnObject;
};

this.parseLabel = function (label) {
  var fullLabel = '';
  label = label.split('-');

  for (var i = 1; i < label.length; i++) {
    var firstLetter = label[i][0];
    fullLabel = fullLabel + firstLetter.toUpperCase() + label[i].substring(1) + ' ';
  }

  fullLabel = label[0] + ' - ' + fullLabel;
  return fullLabel.trim();
};

this.getIssueUrlFromDraggable = function (ui) {
  return ui.item[0].childNodes[0].childNodes[1].href.replace('github.com/', 'api.github.com/repos/');
};

this.getAccessTokenParam = function () {
  return "?access_token=" + this.getCurrentAuthToken();
};

this.getState = function (className) {
  return className.search('done') != -1 ? 'closed' : 'open';
};

this.changeNewIssueLink = function (event, projectName) {
  $(".link").attr("href", this.newIssueURL(projectName));
};

this.blockUI = function () {
  $.blockUI();
};

this.unblockUI = function (e, timeout) {
  setTimeout($.unblockUI, (timeout || 0));
};

this.mountExportClick =  function(ev,data){
  this.trigger('data:issues:mountExportCsvLink', {
    issues: this.attr.issues
  });
};

this.clearIssues = function(){
  this.attr.issues = [];
};


this.after('initialize', function () {
  this.on('ui:needs:issues', this.fetchIssues);
  this.on('ui:add:issue', this.addIssue);
  this.on('ui:create:issue', this.createIssue);
  this.on('ui:assigns:user', this.assignMyselfToIssue);
  this.on('data:githubUser:here', this.assignMyselfToIssue);
  this.on('ui:draggable', this.draggable);
  this.on('ui:issue:createIssuesURL', this.changeNewIssueLink);
  this.on('#export_csv', 'click' , this.mountExportClick);
  this.on('ui:unassign:user', this.unassignMyselfToIssue);
  this.on('ui:blockUI', this.blockUI);
  this.on('ui:unblockUI', this.unblockUI);
  this.on('ui:clear:issue', this.clearIssues);

});
}
}
);
