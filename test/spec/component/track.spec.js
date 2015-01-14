describeComponent('component/track', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
    expect(this.component).not.toBe(undefined);  
  });

  describe("get labeled issue", function(){
    it('issue without labels should be backlog', function () {
      
      var issue = { labels : [] , state : "open"};

      

      this.component.attr.trackType = "0 - Backlog";  

      var result = this.component.isIssueOnThisTrack(issue);

      expect(true).toEqual(result);
    });
  });
}); 
