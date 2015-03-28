describeComponent('component/data/issues_exporter', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  it('creates a csv link and adds new issues to the end of it', function () {
    var issues = [
      {
        "projectName": "pixelated-platform",
        "number": "90",
        "title": "sending mails",
        "state": "open",
        "labels": [{
          name: "1- Backlog"
        }, {
          name: "2- Dev"
        }],
        "kanbanState": "1 - Ready",
        "body": "should send email",
        "created_at": "2014-11-10T13:29:41Z",
        "closed_at": "2014-11-19T13:28:41Z",
        "ready_at": "2014-11-12T14:00:41Z",
        "development_at": "2014-11-13T14:00:41Z",
        "quality_assurance_at": "2014-11-17T10:00:41Z"
      },
      {
        "projectName": "pixelated-user-agent",
        "number": "92",
        "title": "handle errors on sending mails",
        "state": "open",
        "labels": [{
          name: "3- Quality Assurance"
        }, {
          name: "2- Dev"
        }],
        "kanbanState": "0 - Backlog",
        "body": "If mails can't be sent by the twisted process",
        "created_at": "2014-11-11T13:29:41Z",
        "closed_at": "2014-11-19T13:29:41Z",
        "ready_at": "2014-11-12T14:00:41Z",
        "development_at": "2014-11-14T14:00:41Z",
        "quality_assurance_at": "2014-11-16T11:00:41Z"
      }
    ];

    var contentToEncode = "Source;Github ID;Title;Status;Kanban State;Tags;Create at;Closed at;Lead Time;ready at;development at;quality_assurance at" +
      "\n\"pixelated-platform\";90;\"sending mails\";open;1 - Ready;\"1- Backlog,2- Dev\";2014-11-10T13:29:41Z;2014-11-19T13:28:41Z;8;2014-11-12T14:00:41Z;2014-11-13T14:00:41Z;2014-11-17T10:00:41Z" +
      "\n\"pixelated-user-agent\";92;\"handle errors on sending mails\";open;0 - Backlog;\"3- Quality Assurance,2- Dev\";2014-11-11T13:29:41Z;2014-11-19T13:29:41Z;8;2014-11-12T14:00:41Z;2014-11-14T14:00:41Z;2014-11-16T11:00:41Z\n";

    expect(this.component.linkToCsv(issues)).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(contentToEncode));

    var newIssues = [{
      "projectName": "test-issues-ramon",
      "number": "66",
      "labels": [],
      "title": "handle errors on sending mails",
      "state": "open",
      "kanbanState": "1 - Backlog",
      "body": "just testing an issue"
    }];

    var newIssuesToEncode = "\"test-issues-ramon\";66;\"handle errors on sending mails\";open;1 - Backlog;\"\";;;;;;\n";

    expect(this.component.linkToCsv(newIssues)).toEqual("data:text/csv;charset=utf8," + encodeURIComponent(contentToEncode + newIssuesToEncode));
  });

  it('should map all the events to the given issues', function () {
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
        {
          id: 197865884,
          event: 'labeled',
          issue: {
            id: 49941278
          }
        },
        {
          id: 197865885,
          event: 'labeled',
          issue: {
            id: 49941278
          }
        }
      ],
      49941279: [
        {
          id: 197865882,
          event: 'labeled',
          issue: {
            id: 49941279
          }
        },
        {
          id: 197865883,
          event: 'labeled',
          issue: {
            id: 49941279
          }
        }
      ]
    });
  });

  it('should exclude the events that are different than labeled', function () {
    var mappedEvents = {
      49941278: [
        {
          id: 197865884,
          event: 'labeled',
          issue: {
            id: 49941278
          }
        },
        {
          id: 197865888,
          event: 'assigned',
          issue: {
            id: 49941278
          }
        },
        {
          id: 197865885,
          event: 'labeled',
          issue: {
            id: 49941278
          }
        }
      ],
      49941279: [
        {
          id: 197865882,
          event: 'labeled',
          issue: {
            id: 49941279
          }
        },
        {
          id: 197865889,
          event: 'othertype',
          issue: {
            id: 49941279
          }
        },
        {
          id: 197865883,
          event: 'labeled',
          issue: {
            id: 49941279
          }
        }
     ]
    };

    expect(this.component.excludeNonLabeledEvents(mappedEvents)).toEqual({
      49941278: [
        {
          id: 197865884,
          event: 'labeled',
          issue: {
            id: 49941278
          }
        },
        {
          id: 197865885,
          event: 'labeled',
          issue: {
            id: 49941278
          }
        }
      ],
      49941279: [
        {
          id: 197865882,
          event: 'labeled',
          issue: {
            id: 49941279
          }
        },
        {
          id: 197865883,
          event: 'labeled',
          issue: {
            id: 49941279
          }
        }
      ]
    });

  });

  it('should get only the events that corresponds when the issue was moved to the label column', function () {
    var labeledEvents = {
      49941278: [
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "0 - Backlog"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-25T20:54:52Z"
        }
      ],
      49941279: [
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-26T20:54:52Z"
        },
        {
          label: {
            name: "3 - Quality Assurance"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-23T20:54:52Z"
        }
      ]
    };

    expect(this.component.getIssueEventsByLabel(labeledEvents, '2 - Development')).toEqual({
      49941278: [
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-25T20:54:52Z"
        }
          ],
      49941279: [
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-26T20:54:52Z"
        },
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-23T20:54:52Z"
        }
          ]
    });
  });

  it('should get the earlier event for each issue that corresponds when the issue was moved to the label column', function () {
    var labeledEvents = {
      49941278: [
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "0 - Backlog"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-25T20:54:52Z"
        }
      ],
      49941279: [
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-26T20:54:52Z"
        },
        {
          label: {
            name: "3 - Quality Assurance"
          },
          created_at: "2014-11-24T20:54:52Z"
        },
        {
          label: {
            name: "2 - Development"
          },
          created_at: "2014-11-23T20:54:52Z"
        }
      ]
    };

    expect(this.component.getEarliestIssueEvents(labeledEvents, '2 - Development')).toEqual({
      49941278: {
        label: {
          name: "2 - Development"
        },
        created_at: "2014-11-24T20:54:52Z"
      },
      49941279: {
        label: {
          name: "2 - Development"
        },
        created_at: "2014-11-23T20:54:52Z"
      }
    });
  });

  it('should create the labeled_at date for each issue according to its event creation date', function () {
    var issues = [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
    ];

    var events = {
      1: {
        created_at: "2014-11-24T20:54:52Z"
      },
      2: {
        created_at: "2014-11-23T20:54:52Z"
      }
    };

    expect(this.component.mergeEventsWithIssues(issues, events, 'development_at')).toEqual([
      {
        id: 1,
        development_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 2,
        development_at: "2014-11-23T20:54:52Z"
      },
      {
        id: 3
      }
    ]);
  });

  it('should return the issues with the labeled date using its events', function () {
    var issues = [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
    ];

    var events = [
      {
        id: 197865882,
        event: "labeled",
        issue: {
          id: 1
        },
        label: {
          name: "2 - Development"
        },
        created_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 197865883,
        event: "labeled",
        issue: {
          id: 1
        },
        label: {
          name: "2 - Development"
        },
        created_at: "2014-11-20T20:54:52Z"
      },
      {
        id: 197865887,
        event: "labeled",
        issue: {
          id: 3
        },
        label: {
          name: "2 - Development"
        },
        created_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 197865884,
        event: "assigned",
        issue: {
          id: 2
        },
        label: {
          name: "2 - Development"
        },
        created_at: "2014-11-24T20:54:52Z"
      },
      {
        id: 197865885,
        event: "labeled",
        issue: {
          id: 2
        },
        label: {
          name: "0 - Backlog"
        },
        created_at: "2014-11-24T20:54:52Z"
      }
    ];
    expect(this.component.addEventDateForIssues(issues, events)).toEqual([
      {
        id: 1,
        development_at: "2014-11-20T20:54:52Z"
      },
      {
        id: 2
      },
      {
        id: 3,
        development_at: "2014-11-24T20:54:52Z"
      }
    ]);
  });

  it('should get all the different repositorie urls from the issues', function () {
    var issues = [
      {
        id: 1,
        repoUrl: "https://api.github.com/repos/RocketBoard/test_issues_kanboard/"
      },
      {
        id: 2,
        repoUrl: "https://api.github.com/repos/RocketBoard/test_issues_kanboard/"
      },
      {
        id: 3,
        repoUrl: "https://api.github.com/repos/RocketBoard/test_issues_kanboard2/"
      }
    ];

    expect(this.component.getRepositoriesUrlsFromIssues(issues)).toEqual([
      "https://api.github.com/repos/RocketBoard/test_issues_kanboard/",
      "https://api.github.com/repos/RocketBoard/test_issues_kanboard2/"
    ]);
  });

  it('should remove exporting button', function () {
    this.setupComponent('<a id="exporting_csv" class="btn btn-success btn-xs right not-active">EXPORTING<img src="/img/loading-dots.gif" /></a>');
    this.component.showExportCsvLink();
    expect('#exporting_csv').not.toExist();
  });

  it('should add exporting button', function () {
    this.setupComponent('<a id="export_csv" class="btn btn-success btn-xs right" href="javascript:void(0)">EXPORT TO CSV </a>');
    this.component.showExportingFeedbackLink();
    expect('#exporting_csv').toExist();
  });

  it('should hide export button', function () {
    this.setupComponent('<a id="export_csv" class="btn btn-success btn-xs right" href="javascript:void(0)">EXPORT TO CSV </a>');
    this.component.showExportingFeedbackLink();
    var export_button = document.getElementById("export_csv");
    expect(export_button.getAttribute("style")).toBe("display: none;");
  });

  it('should show export button', function () {
    this.setupComponent('<a id="export_csv" class="btn btn-success btn-xs right" href="javascript:void(0)" style="display: none;">EXPORT TO CSV </a>');
    this.component.showExportCsvLink();
    var export_button = document.getElementById("export_csv");
    expect(export_button.getAttribute("style")).toBe("");
  });

});