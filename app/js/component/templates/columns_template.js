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
  'config/config_bootstrap'
  ], function (config) {
      return columnTemplate;

      function columnTemplate() {
        this.render = function (column) {
          var columnNameParametized = column.column.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
          return this.template.render({
            columnName: column.column,
            columnId: column.order + '-' + columnNameParametized,
            columnClass: columnNameParametized
          });
        };

        this.before('initialize', function () {
          this.template = Hogan.compile(
            '<div class="column">'+
              '<div class="panel panel-default">'+
                '<div class="panel-heading {{columnClass}}-header"><h3>{{columnName}}</h3><span class="issues-count"></div>'+
                '<div class="cards-place">'+
                  '<div class="panel-body issue-track {{columnClass}} list-group" id="{{columnId}}"> </div>'+
                '</div>'+
              '</div>'+
            '</div>'
          );
        });
      };
  });
