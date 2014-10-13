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

    expect(this.component.linkToCsv({'issues': issues})).toEqual("data:text/csv;charset=utf8," + encodeURIComponent("Source;Github ID;Title;Status;Kanban State;Description\npixelated-platform;90;sending mails;open;1 - Ready;should send email\npixelated-user-agent;92;handle errors on sending mails;open;0 - Backlog;If mails can't be sent by the twisted process"))
  });
});
