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
  'flight/lib/component'
  ],
  function (defineComponent) {
    'use strict';

    return defineComponent(columnsGateway);

    function columnsGateway() {
      this.defaultAttrs({
        columnsContainerSeletor: '.columns-container'
      })
      this.showModal = function() {
        this.$node.modal({ backdrop: 'static', keyboard: false });
      };

      this.displayColumns = function(event, data) {
        var columns = _.sortBy(data.columns, function(column) {
          return Number(column['order']);
        });

        this.$node.find(this.attr.columnsContainerSeletor).html('');
        _.each(columns, function(column){
          var columnInput = '<li><input type="text" data-order="'+column.order+'" value="'+column.column+'"></li>';
          this.append(columnInput);
        }, this.$node.find(this.attr.columnsContainerSeletor));
      };

      this.addNewColumn = function() {
        var columnsContainer = this.$node.find(this.attr.columnsContainerSeletor);
        var order = columnsContainer.children().length;
        columnsContainer.append('<li><input type="text" data-order="'+order+'" value=""></li>');
      };

      this.saveColumns = function() {
        var columnsContainer = this.$node.find(this.attr.columnsContainerSeletor);
        var columns = _.chain(columnsContainer.find('input')).
                        filter(function(input) { return !_.isEmpty(input.value); }).
                        map(function(input) { return { column: input.value, order: $(input).data('order') }; }).
                        value();
        $(document).trigger('data:store:columns', [columns]);
        $(document).trigger('data:retrieve:columns');
        this.$node.modal('hide');
      };

      this.changeColumnsEvents = function() {
        $('#changeColumns').click(function(){
          $(document).trigger('ui:show:columnsModal');
          // $(document).trigger('data:retrieve:columns');
        });
      };

      this.addColumnEvent = function() {
        $('#addColumn').click(function() {
          $(document).trigger('ui:show:addColumn');
        });
      };

      this.saveColumnsChanges = function() {
        $('#saveColumnsChanges').click(function() {
          $(document).trigger('ui:show:saveColumns');
        });
      };

      this.setUp = function() {
        this.changeColumnsEvents();
        this.addColumnEvent();
        this.saveColumnsChanges();
      };

      this.after('initialize', function () {
        this.setUp();
        this.on(document, 'ui:show:columnsModal', this.showModal.bind(this));
        this.on(document, 'data:got:columns', this.displayColumns.bind(this));
        this.on(document, 'ui:show:addColumn', this.addNewColumn.bind(this));
        this.on(document, 'ui:show:saveColumns', this.saveColumns.bind(this));
      });
    }
  });
