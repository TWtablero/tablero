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
      'data:text/csv;charset=utf8,Source%2CGithub%20ID%2CTitle%2CStatus%2CKanban%20State%2CDescription%0Apixelated-platform%2C90%2Csending%20mails%2Copen%2C1%20-%20Ready%2Cshould%20send%20email%0Apixelated-user-agent%2C92%2Chandle%20errors%20on%20sending%20mails%2Copen%2C0%20-%20Backlog%2CIf%20mails%20can\'t%20be%20sent%20by%20the%20twisted%20process');
  });
});
