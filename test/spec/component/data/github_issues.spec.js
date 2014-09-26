describeComponent('component/data/github_issues', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  describe("create a issue", function(){
    it('trigger event data:issues:refreshed', function () {
      var eventSpy = spyOnEvent(document, "data:issues:refreshed")

      this.component.trigger("ui:add:issue", {'issue': 'data'});

      expect(eventSpy).toHaveBeenTriggeredOn(document)
      expect(eventSpy.mostRecentCall.data).toEqual({
          'issues': {'issue': 'data'}
      });
    });
  });
});
