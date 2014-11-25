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
      this.csvLink = '';

      this.mountExportCsvLink = function(ev, data) {
        var uri = this.linkToCsv(data);
        $("#export_csv").attr('href', uri);
        //window.open(uri);
      };

      this.clearLink = function(){
        this.csvLink = '';
      }

      this.linkToCsv = function(data) {
        var issuesCsv = this.issuesToCsv(data.issues);
        if(this.csvLink == ''){
          issuesCsv.splice(0, 0, this.csvHeader());
        }

        this.csvLink += encodeURIComponent(issuesCsv.join("\n") + "\n");
        return 'data:text/csv;charset=utf8,' + this.csvLink;
      };

      this.validIssuesToExport = function(issues) {
        return _.filter(issues, function(issue) {
          return issue.projectName != undefined
        });
      }

      this.issuesToCsv = function(issues) {
        var issuesCsv =  _.map(this.validIssuesToExport(issues), function(issue){
            return [issue.projectName,
                  issue.number,
                  "\"" + issue.title + "\"",
                  issue.state,
                  issue.kanbanState,
                  "\"" + issue.body.replace(/(\r\n|\n|\r)/g, " ") + "\"",
                  "\"" + _.map(issue.labels, function(label) {return label.name;}) +  "\"",
                  issue.created_at,
                  issue.closed_at,
                  daysBetween(issue.created_at, issue.closed_at)
                  ].join(';')
        });

        return issuesCsv;
      };

      function daysBetween(earlierDate, lateDate) {
        if (earlierDate && lateDate) {
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
        return ["Source","Github ID","Title","Status","Kanban State","Description", "Tags", "Create at", "Closed at", "Lead Time"].join(';');
      };

      this.groupEventsByIssuesId = function(events) {
          return _.groupBy(events, function(event){ return event.issue.id; });
      };

      this.excludeNonLabeledEvents = function(mappedEvents) {
          return _.object(_.map(mappedEvents, function(issueEvents, key) { return [key, _.filter(issueEvents, function(event) { return event.event == 'labeled'; })]}));
      };

      this.after('initialize', function () {
        this.on('data:issues:mountExportCsvLink', this.mountExportCsvLink);
        this.on('data:issues:clearExportCsvLink', this.clearLink)
      });
    }
  }
);
