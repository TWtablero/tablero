describeComponent('component/track', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
  });

  describe("get labeled issue", function(){
    it('issue without labels should be backlog', function () {
      
      var issue = { labels : [] , state : "open"};

      expect(this.component).not.toBe(undefined); 

      console.log(this.component.isIssueOnThisTrack(issue)); 

      // var result = this.component.isIssueOnThisTrack(issue).bind({ attr : { trackType : "0 - Backlog"}});

      // expect(true).toEqual(result);
    });
  });
}); 
