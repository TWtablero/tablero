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


  it('update draggable issue should trigger event', function() {
    var spyEvent = spyOnEvent(document, 'data:issues:issueMoved');

    var event = { target : { id : '0 - Backlog'}};

    var ui = { item : [ {} ]};

    this.component.updateDraggable(event,ui);

    expect(spyEvent).toHaveBeenTriggeredOn(document);
  });


  it('DOM Object should be turned in a issue param', function() {
    var element = { 
      id : 1,
      dataset : { priority : 1}
    };

    var result = this.component.DOMObjectToIssueMovedParam(element);

    expect(result).toEqual({ id : 1 , priority : 1});

  });

  it('DOM Object undefined should be turned in a issue param', function() {

    var result = this.component.DOMObjectToIssueMovedParam(undefined);

    expect(result).toEqual({ id : 0 , priority : 0});

  });

});
