describeComponent('component/data/issues_exporter', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  it('creates a link to download csv', function() {
    var issues = [
      {
        "projectName": "pixelated-platform",
        "number":   "90",
        "title":    "sending mails",
        "state":   "open",
        "labels": [{name: "1- Backlog"}, {name: "2- Dev"}],
        "kanbanState":   "1 - Ready",
        "body":     "should send email"
      },
      {
        "projectName": "pixelated-user-agent",
        "number":   "92",
        "title":    "handle errors on sending mails",
        "state":   "open",
        "labels": [{name: "3- QA"}, {name: "2- Dev"}],
        "kanbanState":   "0 - Backlog",
        "body":     "If mails can't be sent by the twisted process"
      }
    ];

    expect(this.component.linkToCsv(issues)).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(
        "Source;Github ID;Title;Status;Kanban State;Description;Tags;Create at;Dev at;Closed at;Lead Time;Cycle Time" +
        "\n\"pixelated-platform\";90;\"sending mails\";open;1 - Ready;\"should send email\";\"1- Backlog,2- Dev\";;;;;" +
        "\n\"pixelated-user-agent\";92;\"handle errors on sending mails\";open;0 - Backlog;\"If mails can't be sent by the twisted process\";\"3- QA,2- Dev\";;;;;\n"));
  });

  it('creates a csv link and adds new issues to the end of it', function(){
    var issues = [
      {
        "projectName": "pixelated-platform",
        "number":   "90",
        "title":    "sending mails",
        "state":   "open",
        "labels": [],
        "kanbanState":   "1 - Ready",
        "body":     "should send email"
      },
      {
        "projectName": "pixelated-user-agent",
        "number":   "92",
        "title":    "handle errors on sending mails",
        "state":   "open",
        "labels": [],
        "kanbanState":   "0 - Backlog",
        "body":     "If mails can't be sent by the twisted process"
      }
    ];

    var contentToEncode = "Source;Github ID;Title;Status;Kanban State;Description;Tags;Create at;Dev at;Closed at;Lead Time;Cycle Time" +
                          "\n\"pixelated-platform\";90;\"sending mails\";open;1 - Ready;\"should send email\";\"\";;;;;" +
                          "\n\"pixelated-user-agent\";92;\"handle errors on sending mails\";open;0 - Backlog;\"If mails can't be sent by the twisted process\";\"\";;;;;\n";

    expect(this.component.linkToCsv(issues)).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(contentToEncode));

    var newIssues = [{
        "projectName": "test-issues-ramon",
        "number":   "66",
        "labels": [],
        "title":    "handle errors on sending mails",
        "state":   "open",
        "kanbanState":   "1 - Backlog",
        "body":     "just testing an issue"
    }];

    var newIssuesToEncode = "\"test-issues-ramon\";66;\"handle errors on sending mails\";open;1 - Backlog;\"just testing an issue\";\"\";;;;;\n";

    expect(this.component.linkToCsv(newIssues)).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(contentToEncode + newIssuesToEncode));
  });

  it('should create the csv with proper issue`s lead time according to its create and closed date', function() {
    var issues = [
      {
        "projectName": "test-issues-leadTime-0",
        "body": "lead time description-0",
        "labels": [],
        "title": "",
        "created_at": "2014-11-18T13:29:41Z",
        "closed_at": "2014-11-19T13:28:41Z",
        "dev_at": "2014-11-18T14:00:41Z"
      },
      {
        "projectName": "test-issues-leadTime-1",
        "body": "lead time description-1",
        "labels": [],
        "title": "",
        "created_at": "2014-11-18T13:29:41Z",
        "closed_at": "2014-11-19T13:29:41Z",
        "dev_at": "2014-11-18T14:00:41Z"
      },
      {
        "projectName": "test-issues-leadTime-3",
        "body": "lead time description-3",
        "labels": [],
        "title": "",
        "created_at": "2014-11-18T13:29:41Z",
        "closed_at": "2014-11-21T13:30:41Z",
        "dev_at": "2014-11-20T13:00:41Z"
      }
    ];

    expect(this.component.linkToCsv(issues)).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(
        "Source;Github ID;Title;Status;Kanban State;Description;Tags;Create at;Closed at;Lead Time" +
        "\n\"test-issues-leadTime-0\";;\"\";;;\"lead time description-0\";\"\";2014-11-18T13:29:41Z;2014-11-19T13:28:41Z;0" +
        "\n\"test-issues-leadTime-1\";;\"\";;;\"lead time description-1\";\"\";2014-11-18T13:29:41Z;2014-11-19T13:29:41Z;1" +
        "\n\"test-issues-leadTime-3\";;\"\";;;\"lead time description-3\";\"\";2014-11-18T13:29:41Z;2014-11-21T13:30:41Z;3\n"));
  });

  it('should map all the events to the given issues', function() {
    var events = [
      {
        id: 197865882,
        event: "labeled",
        issue: {
          id: 49941279
        }
      },
      {
        id: 197865883,
        event: "labeled",
        issue: {
          id: 49941279
        }
      },
      {
        id: 197865884,
        event: "labeled",
        issue: {
          id: 49941278
        }
      },
      {
        id: 197865885,
        event: "labeled",
        issue: {
          id: 49941278
        }
      }
    ];

    expect(this.component.groupEventsByIssuesId(events)).toEqual({
      49941278: [
        {id: 197865884, event: 'labeled', issue: {id : 49941278}},
        {id: 197865885, event: 'labeled', issue: {id : 49941278}}
      ],
      49941279: [
        {id : 197865882, event: 'labeled', issue: {id : 49941279}},
        {id : 197865883, event: 'labeled', issue: {id : 49941279}}
      ]});
  });

  it('should exclude the events that are different than labeled', function() {
    var mappedEvents = {
      49941278: [
        {id: 197865884, event: 'labeled', issue: {id : 49941278}},
        {id: 197865888, event: 'assigned', issue: {id : 49941278}},
        {id: 197865885, event: 'labeled', issue: {id : 49941278}}
      ],
      49941279: [
        {id : 197865882, event: 'labeled', issue: {id : 49941279}},
        {id : 197865889, event: 'othertype', issue: {id : 49941279}},
        {id : 197865883, event: 'labeled', issue: {id : 49941279}}
     ]
    };

    expect(this.component.excludeNonLabeledEvents(mappedEvents)).toEqual({
      49941278: [
        {id: 197865884, event: 'labeled', issue: {id : 49941278}},
        {id: 197865885, event: 'labeled', issue: {id : 49941278}}
      ],
      49941279: [
        {id : 197865882, event: 'labeled', issue: {id : 49941279}},
        {id : 197865883, event: 'labeled', issue: {id : 49941279}}
      ]
    });

  });

  it('should get only the events that corresponds when the issue was moved to the Development column', function() {
    var labeledEvents = {
      49941278: [
        {label: {name: "2 - Development"}, created_at: "2014-11-24T20:54:52Z"},
        {label: {name: "0 - Backlog"}, created_at: "2014-11-24T20:54:52Z"},
        {label: {name: "2 - Development"}, created_at: "2014-11-25T20:54:52Z"}
      ],
      49941279: [
        {label: {name: "2 - Development"}, created_at: "2014-11-26T20:54:52Z"},
        {label: {name: "3 - Quality Assurance"}, created_at: "2014-11-24T20:54:52Z"},
        {label: {name: "2 - Development"}, created_at: "2014-11-23T20:54:52Z"}
      ]
    };

    expect(this.component.getOnlyDevelopmentIssueEvents(labeledEvents)).toEqual({
          49941278: [
            {label: {name: "2 - Development"}, created_at: "2014-11-24T20:54:52Z"},
            {label: {name: "2 - Development"}, created_at: "2014-11-25T20:54:52Z"}
          ],
          49941279: [
            {label: {name: "2 - Development"}, created_at: "2014-11-26T20:54:52Z"},
            {label: {name: "2 - Development"}, created_at: "2014-11-23T20:54:52Z"}
          ]
        }
    );
  });

  it('should get the earlier event for each issue that corresponds when the issue was moved to the Development column', function() {
    var labeledEvents = {
      49941278: [
        {label: {name: "2 - Development"}, created_at: "2014-11-24T20:54:52Z"},
        {label: {name: "0 - Backlog"}, created_at: "2014-11-24T20:54:52Z"},
        {label: {name: "2 - Development"}, created_at: "2014-11-25T20:54:52Z"}
      ],
      49941279: [
        {label: {name: "2 - Development"}, created_at: "2014-11-26T20:54:52Z"},
        {label: {name: "3 - Quality Assurance"}, created_at: "2014-11-24T20:54:52Z"},
        {label: {name: "2 - Development"}, created_at: "2014-11-23T20:54:52Z"}
      ]
    };

    expect(this.component.getEarliestDevelopmentIssueEvents(labeledEvents)).toEqual({
          49941278: {label: {name: "2 - Development"}, created_at: "2014-11-24T20:54:52Z"},
          49941279: {label: {name: "2 - Development"}, created_at: "2014-11-23T20:54:52Z"}
        }
    );
  });

  it('should create the dev_at date for each issue according to its event creation date', function() {
    var issues = [
      {id: 1},
      {id: 2},
      {id: 3}
    ];

    var events = {
      1: {created_at: "2014-11-24T20:54:52Z"},
      2: {created_at: "2014-11-23T20:54:52Z"}
    };

    expect(this.component.mergeEventsWithIssues(issues, events)).toEqual([
      {id: 1, dev_at: "2014-11-24T20:54:52Z"},
      {id: 2, dev_at: "2014-11-23T20:54:52Z"},
      {id: 3}
    ]);
  });

  it('should return the issues with the development date using its events', function() {
    var issues = [
      {id: 1},
      {id: 2},
      {id: 3}
    ];

    var events = [
      {
        id: 197865882,
        event: "labeled",
        issue: {
          id: 1
        },
        label: {name: "2 - Development"},
        created_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 197865883,
        event: "labeled",
        issue: {
          id: 1
        },
        label: {name: "2 - Development"},
        created_at: "2014-11-20T20:54:52Z"
      },
      {
        id: 197865887,
        event: "labeled",
        issue: {
          id: 3
        },
        label: {name: "2 - Development"},
        created_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 197865884,
        event: "assigned",
        issue: {
          id: 2
        },
        label: {name: "2 - Development"},
        created_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 197865885,
        event: "labeled",
        issue: {
          id: 2
        },
        label: {name: "0 - Backlog"},
        created_at: "2014-11-24T20:54:52Z"
      }
    ];
    expect(this.component.addDevDateForIssues(issues, events)).toEqual([
      {id: 1, dev_at: "2014-11-20T20:54:52Z"},
      {id: 2},
      {id: 3, dev_at: "2014-11-24T20:54:52Z"}
    ]);
  });

  it('should get all the different repositorie urls from the issues', function() {
    var issues = [
      {id: 1, repoUrl: "https://api.github.com/repos/RocketBoard/test_issues_kanboard/"},
      {id: 2, repoUrl: "https://api.github.com/repos/RocketBoard/test_issues_kanboard/"},
      {id: 3, repoUrl: "https://api.github.com/repos/RocketBoard/test_issues_kanboard2/"}
    ];

    expect(this.component.getRepositoriesUrlsFromIssues(issues)).toEqual([
      "https://api.github.com/repos/RocketBoard/test_issues_kanboard/",
      "https://api.github.com/repos/RocketBoard/test_issues_kanboard2/"
    ]);
  });

});
