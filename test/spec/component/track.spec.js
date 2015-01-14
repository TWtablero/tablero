describeComponent('component/track', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
    expect(this.component).not.toBe(undefined);  
  });

  describe('get labeled issue', function(){
    it('issue open and without labels should be backlog', function () {
      
      var issue = { labels : [] , state : 'open'};
      
      this.component.attr.trackType = '0 - Backlog';  

      var result = this.component.isIssueOnThisTrack(issue);

      expect(true).toEqual(result);
    });

     it('issue open and with labels should have status equal yours labels', function () {
      
      var issue = { labels : [ { name : '1 - Ready' } ] , state : 'open'};
      
      this.component.attr.trackType = '1 - Ready';  

      var result = this.component.isIssueOnThisTrack(issue);

      expect(true).toEqual(result);
    });

    it('issue closed  should be 4 - Done', function () {
      
      var issue = { labels : [{ name : '1 - Ready' }] , state : 'closed'};

      this.component.attr.trackType = '4 - Done';  

      var result = this.component.isIssueOnThisTrack(issue);

      expect(true).toEqual(result);
    });
  });
}); 
