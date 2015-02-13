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
  'jquery-cookie/jquery.cookie'
  ],
  function (defineComponent, withAuthTokeFromHash) {
    return defineComponent(githubUser, withAuthTokeFromHash);

    function githubUser() {
      this.getCurrentGithubUser = function (ev, previousData) {
        var token = this.getCurrentAuthToken();

        if(!token){
          var selectedAccess = $.cookie('access');
          if(selectedAccess) {
            $(document).trigger('ui:show:permissionSelected', [selectedAccess]);
          } else {
            $(document).trigger('ui:show:permissionsModal');
          }
    		} else {
          $.getJSON('https://api.github.com/user', {access_token: token}, function (userData, textStatus, request) {
            var newData = _.clone(previousData.data);
            if (newData != undefined) {
              newData.user = userData;
            }

            if(previousData.callback){
              previousData.callback.call(previousData.context, ev, newData);
            }
          }.bind(this));
        }
      };

      this.after('initialize', function () {
        this.on(document,'ui:needs:githubUser', this.getCurrentGithubUser);
      });
    }
  }
  );
