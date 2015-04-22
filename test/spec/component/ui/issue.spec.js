'use strict';

describeComponent('component/ui/issue', function () {
  it('should be defined', function () {
    this.setupComponent();
    expect(this.component).toBeDefined();
  });

  describe("Filtering tests", function () {
    it('should hide issue', function () {
     var issue = { repoName: "myRepo" };
     var filteredRepo = "myRepo";
     this.setupComponent('<input type="checkbox" id="repository-0" checked="true" repo="myRepo">', { issue: issue } );
     $(document).trigger("ui:dontShowRepoIssues", {repo: filteredRepo});
     expect($(document).find("#repository-0").is(":visible")).toBe(false);
    });

    it('should show issue if its hidden', function () {
      var issue = { repoName: "myRepo", state: "open" };
      var filteredRepo = "myRepo";
      this.setupComponent('<input type="checkbox" id="repository-0" checked="true" repo="myRepo">', { issue: issue } );
      $(document).trigger("ui:dontShowRepoIssues", {repo: filteredRepo});
      $(document).trigger("ui:showRepoIssues", {repo: filteredRepo});
      expect($(document).find("#repository-0").is(":visible")).toBe(true);
    });

   it('should not change issue if its closed', function () {
      var issue = { repoName: "myRepo", state: "closed" };
      var filteredRepo = "myRepo";
      this.setupComponent('<input type="checkbox" id="repository-0" checked="false" repo="myRepo">', { issue: issue } );
      $(document).trigger("ui:dontShowRepoIssues", {repo: filteredRepo});
      $(document).trigger("ui:showRepoIssues", {repo: filteredRepo});
      expect($(document).find("#repository-0").is(":visible")).toBe(false);
    });


  });

});
