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
  ],
  function(defineComponent, withAuthTokemFromHash) {
    'use strict';
    return defineComponent(issuesExporter, withAuthTokemFromHash);

    function issuesExporter() {
      this.defaultAttrs({
        customColumns: ['1 - Ready', '2 - Development', '3 - Quality Assurance']
      });

      var issuesToExport = [];

      var csvLink = '';

      this.storeColumns = function(ev, columns) {
        var columns = columns.columns;

        this.attr.customColumns = _.map(columns, function(column) {
          return (parseInt(column['order']) + 1) + ' - ' + column['column'];
        });

      };


      this.cleanLabel = function(label) {
        return label.trim().
               replace(/^[^a-zA-Z]+/g, '').
               replace(/[^a-zA-Z[0-9]\s]/g, '').
               replace(/\s/g, '_').
               toLowerCase();
      };

      this.mountExportCsvLink = function(ev, data) {
        var repositoriesUrls = this.getRepositoriesUrlsFromIssues(data.issues);
        issuesToExport = data.issues;
        this.getEventsFromProjects(repositoriesUrls);
      };

      this.clearLink = function() {
        csvLink = '';
      };

      this.showExportingFeedbackLink = function(){
        $('#export_csv').hide();
        $('#export_csv').after('<a id="exporting_csv" class="btn btn-success btn-xs right not-active">EXPORTING<img src="/img/loading-dots.gif" /></a>');
      };

      this.showExportCsvLink = function(){
        $('#exporting_csv').remove();
        $('#export_csv').show();
      };

      this.linkToCsv = function(data) {
        var issuesCsv = this.issuesToCsv(data);
        if (csvLink === '') {
          issuesCsv.splice(0, 0, this.csvHeader());
        }

        csvLink += encodeURIComponent(issuesCsv.join('\n') + '\n');
        return 'data:text/csv;charset=utf8,' + csvLink;
      };

      this.validIssuesToExport = function(issues) {
        return _.filter(issues, function(issue) {
          return issue.projectName !== undefined;
        });
      };

      this.issuesToCsv = function(issues) {
        var issuesCsv = _.map(this.validIssuesToExport(issues), function(issue) {
          var data = ['\"' + issue.projectName + "\"",
            issue.number,
            "\"" + issue.title + "\"",
            issue.state,
            issue.kanbanState,
            "\"" + _.map(issue.labels, function(label) {
              return label.name;
            }) + "\"",
            issue.created_at,
            issue.closed_at,
            daysBetween(issue.created_at, issue.closed_at),
          ];
          _.each(this.attr.customColumns, function(column) {
            data.push(issue[this.cleanLabel(column)+"_at"]);
          }, this);
          return data.join(';');
        }, this);

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

      this.csvHeader = function() {
        var header = ["Source", "Github ID", "Title", "Status", "Kanban State", "Tags", "Create at", "Closed at", "Lead Time"]
        _.each(this.attr.customColumns, function(label) {
          header.push(this.cleanLabel(label) + " at");
        }, this);
        return header.join(';');
      };

      this.getEventsFromProjects = function(projectsUrl) {
        var events = [];
        var self = this;

        function getEvents(url) {
          $.get(url, function(data, textStatus, request) {
            events = events.concat(data);

            try {
              var header = request.getResponseHeader('Link');
              var next = header.match(/<.*?>; rel="next"/)[0].match(/https.*[0-9]+/)[0];
              if (next) {
                getEvents(next);
              }
            } catch (err) {}
          });
        }

        $.each(projectsUrl, function(index, val) {
          getEvents(val + 'issues/events?per_page=100&access_token=' + this.getCurrentAuthToken());
        }.bind(self));

        $(document).one('ajaxStop', function() {
          self.createCsvUri(self.addEventDateForIssues(issuesToExport, events));
        });
      };

      this.groupEventsByIssuesId = function(events) {
        return _.groupBy(events, function(event) {
          return event.issue.id;
        });
      };

      this.excludeNonLabeledEvents = function(mappedEvents) {
        return _.object(_.map(mappedEvents, function(issueEvents, key) {
          return [key, _.filter(issueEvents, function(event) {
            return event.event == 'labeled';
          })]
        }));
      };

      this.getIssueEventsByLabel = function(labeledEvents, label) {
        return _.object(_.map(labeledEvents, function(issueEvents, key) {
          return [key, _.filter(issueEvents, function(event) {
            return event.label.name == label;
          })]
        }));
      };

      this.getEarliestIssueEvents = function(labeledEvents) {
        return _.object(_.map(labeledEvents, function(events, key) {
          return [key, _.first(_.sortBy(events, function(e) {
            return e.created_at;
          }))]
        }));
      };

      this.mergeEventsWithIssues = function(issues, events, key) {
        return _.each(issues, function(issue) {
          if (events[issue.id]) {
            issue[key] = events[issue.id].created_at;
          }
        });
      };

      this.getRepositoriesUrlsFromIssues = function(issues) {
        return _.uniq(_.pluck(issues, 'repoUrl'));
      };

      this.addEventDateForIssues = function(issues, events) {
        var groupedEventsByIssueId = {},
          labeledEvents = {},
          labelEvents = {},
          earlierstIssuesEvent = {},
          issuesWithEventDate = issues,

        groupedEventsByIssueId = this.groupEventsByIssuesId(events);
        labeledEvents = this.excludeNonLabeledEvents(groupedEventsByIssueId);
        _.each(this.attr.customColumns, function(label) {
          labelEvents = this.getIssueEventsByLabel(labeledEvents, label);
          earlierstIssuesEvent = this.getEarliestIssueEvents(labelEvents);
          issuesWithEventDate = this.mergeEventsWithIssues(issuesWithEventDate, earlierstIssuesEvent, this.cleanLabel(label)+"_at")
        }, this);

        return issuesWithEventDate;
      };

      this.createCsvUri = function(issuesWithEventDate) {
        var uri = this.linkToCsv(issuesWithEventDate);

        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        issuesToExport = [];
        this.trigger('data:issues:clearExportCsvLink');

      };

      this.after('initialize', function() {
        this.on('data:got:columns',               this.storeColumns);
        this.on('data:issues:mountExportCsvLink', this.mountExportCsvLink);
        this.on('data:issues:mountExportCsvLink', this.showExportingFeedbackLink);
        this.on('data:issues:clearExportCsvLink', this.clearLink);
        this.on('data:issues:clearExportCsvLink', this.showExportCsvLink);

      });
    }
  }
);
