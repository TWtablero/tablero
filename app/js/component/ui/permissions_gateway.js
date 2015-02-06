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
  'jquery-cookie/jquery.cookie'
  ],
	function (defineComponent) {
		'use strict';
		return defineComponent(permissionsGateway);

		function permissionsGateway() {
      var that = this;
			this.defaultAttrs({

			});

      this.showRepository = function(configs) {
        console.log('pedindo permissao nos repositorios ' + configs.repositories);
        window.location.replace('/request_code' + (configs.params || ''));
      };

			this.showPublic = function() {
        that.showRepository({
          repositories: 'publico e privado'
        })
			};

			this.showPublicAndPrivate = function() {
        that.showRepository({
          repositories: 'publico e privado',
          params: '?requestPrivateRepositories=true'
        })
			};

			this.showModal = function() {
        var already_selected_scope = $.cookie('scope');
        if(!already_selected_scope) {
          this.$node.modal({
            backdrop: 'static',
            keyboard: false
          });
        }
        else {
          this.showRepository({
            repositories: already_selected_scope
          });
        }
			};

			this.setUp = function() {
				$('#showPublicBtn').click(this.showPublic);
				$('#showPublicAndPrivateBtn').click(this.showPublicAndPrivate);
			};

			this.after('initialize', function () {
				this.setUp();
				this.on(document,'ui:show:permissionsModal', this.showModal);
			});

		}
	});
