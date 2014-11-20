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
        "tags": ["1- Backlog", "2- Dev"],
        "kanbanState":   "1 - Ready",
        "body":     "should send email"
      },
      {
        "repoName": "pixelated-user-agent",
        "number":   "92",
        "title":    "handle errors on sending mails",
        "state":   "open",
        "tags": ["3- QA", "2- Dev"],
        "kanbanState":   "0 - Backlog",
        "body":     "If mails can't be sent by the twisted process"
      }
    ];

    expect(this.component.linkToCsv({'issues': issues})).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(
        "Source;Github ID;Title;Status;Kanban State;Description;Tags;Create at;Dev at;Closed at;Lead Time;Cycle Time" +
        "\npixelated-platform;90;\"sending mails\";open;1 - Ready;\"should send email\";\"1- Backlog,2- Dev\";;;;;" +
        "\npixelated-user-agent;92;\"handle errors on sending mails\";open;0 - Backlog;\"If mails can't be sent by the twisted process\";\"3- QA,2- Dev\";;;;;\n"));
  });

  it('creates a csv link and adds new issues to the end of it', function(){
    var issues = [
      {
        "repoName": "pixelated-platform",
        "number":   "90",
        "title":    "sending mails",
        "state":   "open",
        "tags": [],
        "kanbanState":   "1 - Ready",
        "body":     "should send email"
      },
      {
        "repoName": "pixelated-user-agent",
        "number":   "92",
        "title":    "handle errors on sending mails",
        "state":   "open",
        "tags": [],
        "kanbanState":   "0 - Backlog",
        "body":     "If mails can't be sent by the twisted process"
      }
    ];

    var contentToEncode = "Source;Github ID;Title;Status;Kanban State;Description;Tags;Create at;Dev at;Closed at;Lead Time;Cycle Time" +
                          "\npixelated-platform;90;\"sending mails\";open;1 - Ready;\"should send email\";\"\";;;;;" +
                          "\npixelated-user-agent;92;\"handle errors on sending mails\";open;0 - Backlog;\"If mails can't be sent by the twisted process\";\"\";;;;;\n";

    expect(this.component.linkToCsv({'issues': issues})).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(contentToEncode));

    var newIssues = [{
        "repoName": "test-issues-ramon",
        "number":   "66",
        "tags": [],
        "title":    "handle errors on sending mails",
        "state":   "open",
        "kanbanState":   "1 - Backlog",
        "body":     "just testing an issue"
    }];

    var newIssuesToEncode = "test-issues-ramon;66;\"handle errors on sending mails\";open;1 - Backlog;\"just testing an issue\";\"\";;;;;\n";

    expect(this.component.linkToCsv({'issues': newIssues})).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(contentToEncode + newIssuesToEncode));
  });

  it('should create the csv with proper issue`s lead time according to its create and closed date', function() {
    var issues = [
      {
        "repoName": "test-issues-leadTime-0",
        "body": "lead time description-0",
        "tags": [],
        "title": "",
        "created_at": "2014-11-18T13:29:41Z",
        "closed_at": "2014-11-19T13:28:41Z",
        "dev_at": "2014-11-18T14:00:41Z"
      },
      {
        "repoName": "test-issues-leadTime-1",
        "body": "lead time description-1",
        "tags": [],
        "title": "",
        "created_at": "2014-11-18T13:29:41Z",
        "closed_at": "2014-11-19T13:29:41Z",
        "dev_at": "2014-11-18T14:00:41Z"
      },
      {
        "repoName": "test-issues-leadTime-3",
        "body": "lead time description-3",
        "tags": [],
        "title": "",
        "created_at": "2014-11-18T13:29:41Z",
        "closed_at": "2014-11-21T13:30:41Z",
        "dev_at": "2014-11-20T13:00:41Z"
      }
    ];

    expect(this.component.linkToCsv({'issues': issues})).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(
        "Source;Github ID;Title;Status;Kanban State;Description;Tags;Create at;Dev at;Closed at;Lead Time;Cycle Time" +
        "\ntest-issues-leadTime-0;;\"\";;;\"lead time description-0\";\"\";2014-11-18T13:29:41Z;2014-11-18T14:00:41Z;2014-11-19T13:28:41Z;0;0" +
        "\ntest-issues-leadTime-1;;\"\";;;\"lead time description-1\";\"\";2014-11-18T13:29:41Z;2014-11-18T14:00:41Z;2014-11-19T13:29:41Z;1;0" +
        "\ntest-issues-leadTime-3;;\"\";;;\"lead time description-3\";\"\";2014-11-18T13:29:41Z;2014-11-20T13:00:41Z;2014-11-21T13:30:41Z;3;1\n"));
  });
});
