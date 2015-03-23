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
   'component/mixins/repositories_urls'
  ],
  function (defineComponent, withAuthTokeFromHash, repositoriesURLs) {
    return defineComponent(githubTags, withAuthTokeFromHash, repositoriesURLs);

    function githubTags() {
      this.defaultAttrs({
        tags : [
          '0 - Backlog',
          '1 - Ready',
          '2 - Development',
          '3 - Quality Assurance',
          '4 - Done'
        ]
      });

      this.getProjectTags = function() {
        var availableTags = this.getAllTagsFromProjects();
        $.when.apply(this, availableTags).then(
          function () {
            _(arguments).each(function (repos) {
              _(repos[0]).each(function(label) {
                if (!_.contains(this.attr.tags, label.name)){
                  this.attr.tags.push(label.name);
                }
              }.bind(this));
            }.bind(this));
            this.addTags();
          }
        .bind(this));
      }

      this.addTags = function() {
        var template = Hogan.compile('<option>{{label}}</option>');
        $('#labels').empty();
        _(this.attr.tags.sort()).each(function (label) {
            $("#labels").append(template.render({label: label}));
        }.bind(this));
      }

      this.after('initialize', function () {
        this.on(document,'ui:needs:tags', this.getProjectTags);
      });
    }
  }
  );
