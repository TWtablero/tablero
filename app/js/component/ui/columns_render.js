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
  'component/templates/columns_template'
  ], function (defineComponent, withColumnTemplate) {
    'use strict';
    return defineComponent(columnsRender, withColumnTemplate);

    function columnsRender() {
      this.defaultAttrs({
        columnsContainer: '.board-columns',
        track: null,
        githubIssues: null
      });

      this.askForColumns = function() {
        $(document).trigger('data:retrieve:columns');
      };

      this.renderColumns = function(event, data) {
        var columns = _.sortBy(data.columns, function(column) {
          return Number(column['order']);
        });

        var extraColumns = _.map(columns, function(column) { return (Number(column.order) + 1) + ' - ' + column.column; });
        var extraClasses = _.map(columns, function(column) { return column.column.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase(); });;

        this.attr.track.attachTo('.issue-track.backlog', {
          trackType: '0 - Backlog',
          extraAllowedTags: extraColumns,
          columns: extraClasses
        });

        this.attr.track.attachTo('.issue-track.done', {
          trackType: '4 - Done',
          extraAllowedTags: extraColumns,
          columns: extraClasses
        });

        _.each(columns, this.renderColumn(extraClasses, extraColumns), this);

        this.attr.githubIssues.attachTo(document, {
          draggableClasses: extraClasses
        });

        var mountBoard = function(){
          $(document).trigger('ui:needs:issues', {});
          $(document).trigger("ui:issue:createIssuesURL", $("#projects").val());
          $(document).trigger('ui:draggable');
        };
        $(document).trigger('ui:needs:githubUser', { callback : mountBoard });
      };

      this.renderColumn = function(extraClasses, extraColumns) {
        return function(column) {
          column.order = Number(column['order']) + 1;
          $(this.attr.columnsContainer).append(this.render(column));

          var trackType = column.order + ' - ' + column.column;
          var trackClass = column.column.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

          this.attr.track.attachTo('.issue-track.'+ trackClass, {
            trackType: trackType,
            columns: extraClasses,
            extraAllowedTags: extraColumns
          });
        }
      };

      this.after('initialize', function () {
        this.on('ui:needs:columns', this.askForColumns);
        this.on('data:got:columns', this.renderColumns);
      });
    };
  });
