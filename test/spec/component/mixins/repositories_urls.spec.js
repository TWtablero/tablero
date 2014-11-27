describeMixin('component/mixins/repositories_urls', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  describe("issues request", function(){
    it('should send access token and default options', function () {
      var repo = "https://api.github.com/repos/guipdutra/test_issues_kanboard";
      this.component.accessToken = function() { return "access_token=token666"; }

      expect(this.component.repoIssuesURL(repo)).toEqual(
        "https://api.github.com/repos/guipdutra/test_issues_kanboard/issues?per_page=100&state=all&access_token=token666");
    });
  });

  describe("new issue url", function(){
    it('returns the new issue url by project name', function(){
      this.component.getURLFromProject = function(repo){ return "https://api.github.com/repos/guipdutra/test_issues_kanboard" };

      expect(this.component.newIssueURL("user-agent")).toEqual(
        "https://github.com/guipdutra/test_issues_kanboard/issues/new"
      );
    });
  });

  describe('list issues', function(){
    it('alters issue page param', function(){
      var current = 0;
      expect(this.component.getPageParam(current)).toEqual("page=1&");
      expect(this.component.getPageParam(current + 1)).toEqual("page=1&");
      expect(this.component.getPageParam(2)).toEqual("page=2&");
    });

    it('should use page to request issues in default config', function(){
      this.component.accessToken = function() { return "access_token=token666A"; };
      var project = "https://api.github.com/repos/guipdutra/test_issues_kanboard";
      expect(this.component.repoIssuesURL(project, 1)).toEqual(
        "https://api.github.com/repos/guipdutra/test_issues_kanboard/issues?per_page=100&state=all&page=1&access_token=token666A"
      );
    });
  });
});
