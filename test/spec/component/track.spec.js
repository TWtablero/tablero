describeComponent('component/track', function () {
  'use script';

  describe('get labeled issue', function(){
    beforeEach(function () {
      this.setupComponent();
      expect(this.component).not.toBe(undefined);
    });

    it('issue open and without labels should be backlog', function () {

      var issue = { labels : [] , state : 'open'};

      this.component.attr.trackType = '0 - Backlog';

      var result = this.component.isIssueOnThisTrack(issue);

      expect(true).toEqual(result);
    });

    it('issue open and without labels (of status) should be backlog', function () {

      var issue = { labels : [ { name : 'Bug' } ] , state : 'open'};

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

    it('should succesfully render issues without body', function () {
      var issue = { body: null }

      var result = this.component.renderIssue(issue);

      expect(result).not.toBe(null);
    });
  });

  describe('arrange issues to tracks', function(){
    beforeEach(function() {
      var stub = spyOn(this.Component.prototype, 'makeCopyable');
      this.setupComponent();
    });
    var data = { issues: [
      { labels : [], state : 'open', body: 'Some body-ody-ody'},
      { labels: [{name: '1 - Ready'}], state: 'open', body: 'Body-ody-ody'},
      { labels: [], state: 'closed', body: 'body'},
      { labels: [{name: 'LoremIpsum'}], state: 'open', body: 'Body'}
    ]};

    it('non labeled issues goes to backlog track', function(){
      this.component.attr.trackType = '0 - Backlog';
      this.component.displayIssues({}, data);
      expect(this.component.attr.issuesCount).toEqual(2);
    });

    it('closed issues goes to done track', function(){
      this.component.attr.trackType = '4 - Done';
      this.component.displayIssues({}, data);
      expect(this.component.attr.issuesCount).toEqual(1);
    });

    it('links custom labeled issues to columns with same trackType', function(){
      this.component.attr.trackType = 'LoremIpsum';
      this.component.attr.extraAllowedTags = ['LoremIpsum'];
      this.component.displayIssues({}, data);
      expect(this.component.attr.issuesCount).toEqual(1);
    });

  });

});
