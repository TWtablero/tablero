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
  'component/templates/columns_template',
  'component/track',
  'component/data/github_issues',
  'component/data/github_user'
  ], function (defineComponent, withColumnTemplate, track, githubIssues) {
  'use strict';
  return defineComponent(columnsRender, withColumnTemplate);

  function columnsRender() {
    this.defaultAttrs({
      columnsContainer: '.board-columns'
    });

    this.askForColumns = function () {
      $(document).trigger('data:retrieve:columns');
    };

    this.cleanColumns = function () {
      $(this.attr.columnsContainer).children().remove();
      $('.issue-track.backlog .issue').remove();
    };

    this.cleanLabel = function (label) {
      return label.trim().
      replace(/[^a-zA-Z0-9-\s]/g, '').
      replace(/[^a-zA-Z0-9-]/g, '-').
      toLowerCase();
    };

    this.renderColumns = function (event, data) {
      this.cleanColumns();

      var columns = _.sortBy(data.columns, function (column) {
        return Number(column['order']);
      });

      var extraColumns = _.map(columns, function (column) {
        return (Number(column.order) + 1) + ' - ' + column.column;
      });
      var extraClasses = _.map(columns, function (column) {
        return this.cleanLabel(column.column);
      }, this);;

      track.teardownAll();

      track.attachTo('.issue-track.backlog', {
        trackType: '0 - Backlog',
        extraAllowedTags: extraColumns,
        columns: extraClasses
      });

      track.attachTo('.issue-track.done', {
        trackType: '4 - Done',
        extraAllowedTags: extraColumns,
        columns: extraClasses
      });

      _.each(columns, this.renderColumn(extraClasses, extraColumns), this);

      githubIssues.attachTo(document);

        var mountBoard = function(){
          $(document).trigger('ui:needs:issues', {});
          $(document).trigger("ui:issue:createIssuesURL", $("#projects").val());
          $(document).trigger('ui:draggable', {boardColumns: extraClasses});
        };

        if (!window.location.hash.slice(1) && !$.cookie('access')) {
          $(document).trigger('ui:needs:issues', {});
          $('#open_modal_issue').remove();
          $('#changeColumns').remove();
          $('#changeAccess').text('GET ACCESS');
        } else {
          $(document).trigger('ui:needs:githubUser', {callback : mountBoard});
        }
      };

    this.renderColumn = function (extraClasses, extraColumns) {
      var that = this;
      return function (column) {
        column.order = Number(column['order']) + 1;
        $(this.attr.columnsContainer).append(this.render(column));

        var trackType = column.order + ' - ' + column.column;
        var trackClass = that.cleanLabel(column.column);

        track.attachTo('.issue-track.' + trackClass, {
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
