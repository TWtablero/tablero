define(
  ['flight/lib/component'],
  function (defineComponent) {
    return defineComponent(issue);

    function issue() {
      this.hideIssue = function (ev, data) {
        if (this.attr.issue.repoName == data.repo) {
          this.$node.hide();
        }
      };
      this.showIssue = function (ev, data) {
        if (this.attr.issue.repoName == data.repo && this.attr.issue.state == "open" )  {
          this.$node.show();
        }
      };
      this.after('initialize', function () {
        this.on(document, 'ui:dontShowRepoIssues', this.hideIssue);
        this.on(document, 'ui:showRepoIssues', this.showIssue);
      });
    }
  }
);
