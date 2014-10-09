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
      this.mountExportCsvLink = function(ev, data) {
        $("#export_csv").attr('href', this.linkToCsv(data));
      };

      this.linkToCsv = function(data) {
        return 'data:text/csv;charset=utf8,' +
          encodeURIComponent(this.issuesToCsv(data.issues));
      };

      this.validIssuesToExport = function(issues) {
        return _.filter(issues, function(issue) {
          return issue.repoName != undefined
        });
      }

      this.issuesToCsv = function(issues) {
        var issuesCsv =  _.map(this.validIssuesToExport(issues), function(issue){
          return [issue.repoName, issue.number, issue.title, issue.state, issue.kanbanState].join(';')
        });

        issuesCsv.splice(0, 0, this.csvHeader());

        return issuesCsv.join("\n");
      };

      this.csvHeader = function() {
        return ["Source","Github ID","Title","Status","Kanban State"].join(';');
      };

      this.after('initialize', function () {
        this.on('data:issues:mountExportCsvLink', this.mountExportCsvLink);
      });
    }
  }
);
