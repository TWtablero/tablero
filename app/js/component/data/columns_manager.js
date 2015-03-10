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
  'with-request'
  ], function(defineComponent, withRequest) {
    return defineComponent(columnsManager, withRequest);

    function columnsManager() {
      this.retrieve = function() {
        $(document).trigger('ui:blockUI');
        var that = this;
        var defaultColumns = [{order: '1', column: 'Ready'},
                              {order: '2', column: 'Development'},
                              {order: '3', column: 'Quality Assurance'}];

        $.ajax({
          method: 'GET',
          url: 'columns',
        }).done(function(data){
          if (_.isEmpty(data)) {
            data = { columns: defaultColumns };
          }
          that.trigger(document, 'data:got:columns', data);
        });
      };

      this.store = function(event, columns) {
        this.put({
          url: 'columns',
          data: JSON.stringify(columns),
          contentType: 'application/json'
        })
      };

      this.after('initialize', function () {
        this.on('data:retrieve:columns', this.retrieve);
        this.on('data:store:columns', this.store);
      });
    };
  });
