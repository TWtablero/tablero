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
define(['flight/lib/component'],
  function (defineComponent) {
    return defineComponent(issuesExporter);

    function issuesExporter() {
      var issuesToExport = [];

      var csvLink = '';

      this.mountExportCsvLink = function(ev, data) {
        $("#export_csv").attr("disabled", true);
        var repositoriesUrls = this.getRepositoriesUrlsFromIssues(data.issues);
          issuesToExport = data.issues;
        this.getEventsFromProjects(repositoriesUrls);
      };

      this.clearLink = function(){
        csvLink = '';
      }

      this.linkToCsv = function(data) {
        var issuesCsv = this.issuesToCsv(data);
        if(csvLink == ''){
          issuesCsv.splice(0, 0, csvHeader());
        }

        csvLink += encodeURIComponent(issuesCsv.join("\n") + "\n");
        return 'data:text/csv;charset=utf8,' + csvLink;
      };

      this.validIssuesToExport = function(issues) {
        return _.filter(issues, function(issue) {
          return issue.projectName != undefined
        });
      }

      this.issuesToCsv = function(issues) {
        var issuesCsv =  _.map(this.validIssuesToExport(issues), function(issue){
          return ["\"" + issue.projectName + "\"",
                issue.number,
                "\"" + issue.title + "\"",
                issue.state,
                issue.kanbanState,
                "\"" + issue.body.replace(/(\r\n|\n|\r)/g, " ") + "\"",
                "\"" + _.map(issue.labels, function(label) {return label.name;}) +  "\"",
                issue.created_at,
                issue.dev_at,
                issue.closed_at,
                daysBetween(issue.created_at, issue.closed_at),
                daysBetween(issue.dev_at, issue.closed_at)
                ].join(';');
        });

        return issuesCsv;
      };

      function daysBetween(earlierDate, lateDate) {
        if ((earlierDate && lateDate) && (lateDate > earlierDate)) {
          var leadTime,
              millisecondsInDay = 86400000;

          leadTime = (new Date(lateDate) - new Date(earlierDate)) / millisecondsInDay;
          leadTime = parseInt(leadTime);

          return leadTime;
        } else {
          return "";
        }
      };

      function csvHeader() {
        return ["Source","Github ID","Title","Status","Kanban State","Description", "Tags", "Create at", "Dev at", "Closed at", "Lead Time", "Cycle Time"].join(';');
      };

      this.getEventsFromProjects = function(projectsUrl) {
        var events = [];
        var self = this;

        function getEvents(url) {
          $.get(url,function(data,textStatus,request){
            events = events.concat(data);

            try {
              var header = request.getResponseHeader('Link');
              var next = header.match(/<.*?>; rel="next"/)[0].match(/https.*[0-9]+/)[0];
              if(next){
                getEvents(next);
              }
            } catch (err) {
            }
          });
        }

        $.each(projectsUrl, function(index, val) {
          getEvents(val + 'issues/events?per_page=100&access_token=370bf89f94978ff28b11831de0e5d350aa1ccaba');
        });

        $(document).one('ajaxStop', function () {
            self.createCsvUri(self.addDevDateForIssues(issuesToExport, events));
        });
      };

      this.groupEventsByIssuesId = function(events) {
        return _.groupBy(events, function(event){ return event.issue.id; });
      };

      this.excludeNonLabeledEvents = function(mappedEvents) {
        return _.object(_.map(mappedEvents, function(issueEvents, key) { return [key, _.filter(issueEvents, function(event) { return event.event == 'labeled'; })]}));
      };

      this.getOnlyDevelopmentIssueEvents = function(labeledEvents) {
        return _.object(_.map(labeledEvents, function(issueEvents, key) { return [key, _.filter(issueEvents, function(event) { return event.label.name == '2 - Development'; })]}));
      };

      this.getEarliestDevelopmentIssueEvents = function(developmentEvents) {
        return _.object(_.map(developmentEvents, function(events,key) {
          return [key, _.first(_.sortBy(events, function(e) { return e.created_at;}))]
        }));
      };

      this.mergeEventsWithIssues = function(issues, events) {
        return _.each(issues, function(issue) {
          if (events[issue.id]) {
            issue.dev_at =  events[issue.id].created_at;
          }
        });
      };

      this.getRepositoriesUrlsFromIssues = function(issues) {
        return _.uniq(_.pluck(issues, 'repoUrl'));
      };

      this.addDevDateForIssues = function(issues,events) {
        var groupedEventsByIssueId = {},
          labeledEvents = {},
          developmentEvents = {},
          earlierstDevelopemntIssuesEvent = {},
          issuesWithDevDate = {};

        groupedEventsByIssueId = this.groupEventsByIssuesId(events);
        labeledEvents = this.excludeNonLabeledEvents(groupedEventsByIssueId);
        developmentEvents = this.getOnlyDevelopmentIssueEvents(labeledEvents);
        earlierstDevelopemntIssuesEvent = this.getEarliestDevelopmentIssueEvents(developmentEvents);
        issuesWithDevDate = this.mergeEventsWithIssues(issues, earlierstDevelopemntIssuesEvent);

        return issuesWithDevDate;
      };

      this.createCsvUri = function(issuesWithDevDate) {
        var uri = this.linkToCsv(issuesWithDevDate);

        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        $("#export_csv").attr("disabled", false);
        issuesToExport = [];
		    this.trigger('data:issues:clearExportCsvLink');

      };

      this.after('initialize', function () {
        this.on('data:issues:mountExportCsvLink', this.mountExportCsvLink);
        this.on('data:issues:clearExportCsvLink', this.clearLink)
      });
    }
  }
);
