describeComponent('component/data/issues_exporter', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  it('creates a link to download csv', function() {
    var issues = [
      {
        "repoName": "pixelated-platform",
        "number":   "90",
        "title":    "sending mails",
        "state":   "open",
        "kanbanState":   "1 - Ready",
        "body":     "should send email"
      },
      {
        "repoName": "pixelated-user-agent",
        "number":   "92",
        "title":    "handle errors on sending mails",
        "state":   "open",
        "kanbanState":   "0 - Backlog",
        "body":     "If mails can't be sent by the twisted process"
      }
    ]

    expect(this.component.linkToCsv({'issues': issues})).toEqual(
      'data:text/csv;charset=utf8,Source%3BGithub%20ID%3BTitle%3BStatus%3BKanban%20State%0Apixelated-platform%3B90%3Bsending%20mails%3Bopen%3B1%20-%20Ready%0Apixelated-user-agent%3B92%3Bhandle%20errors%20on%20sending%20mails%3Bopen%3B0%20-%20Backlog');
  });
});
