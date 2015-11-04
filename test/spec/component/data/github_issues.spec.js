describeComponent('component/data/github_issues', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
  });

  describe("create a issue", function () {
    it('trigger event data:issues:refreshed', function () {
      var eventSpy = spyOnEvent(document, "data:issues:refreshed");

      this.component.trigger("ui:add:issue", {
        'issue': 'data'
      });

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual({
        'issues': {
          'issue': 'data'
        }
      });
    });
  });

  it('update draggable issue should trigger event', function () {
    var spyEvent = spyOnEvent(document, 'data:issues:issueMoved');

    var event = {
      target: {
        id: '0 - Backlog'
      }
    };

    var ui = {
      item: [{}]
    };

    this.component.updateDraggable(event, ui);

    expect(spyEvent).toHaveBeenTriggeredOn(document);
  });


  it('DOM Object should be turned in a issue param', function () {
    var element = {
      id: 1,
      dataset: {
        priority: 1
      }
    };

    $(sandbox({
      id: 1,
      dataset: {
        priority: 1
      },
    })).append(sandbox());

    var result = this.component.DOMObjectToIssueMovedParam(element);

    expect(result).toEqual({
      id: 1,
      priority: 1
    });

  });

  it('DOM Object undefined should be turned in a issue param', function () {

    var result = this.component.DOMObjectToIssueMovedParam(undefined);

    expect(result).toEqual({
      id: 0,
      priority: 0
    });

  });


  it('GetRepoURLFromIssue should return repository url from all url types', function () {
    var urls = [
    'https://api.github.com/repos/rodrigomaia17/try_git/issues/1',
    'https://api.github.com/repos/rodrigomaia17/try_git./issues/1',
    'https://api.github.com/repos/rodrigomaia17/try_git2/issues/1',
    'https://api.github.com/repos/rodrigomaia17/try_2git/issues/1',
    'https://api.github.com/repos/rodrigomaia17/try_git./issues/1',
    'https://api.github.com/repos/rodrigomaia17/try_git-./issues/1',
    'https://api.github.com/repos/rodrigomaia17/-123123--.try_git.-2--/issues/11',
     'https://api.github.com/repos/pixelated-project/pixelated-user-agent/issues/123',
    'https://api.github.com/repos/pixelated-project/pixelated-dispatcher/issues/412312',
    'https://api.github.com/repos/pixelated-project/project-issues/issues/123',
    'https://api.github.com/repos/pixelated-project/pixelated-platform/issues/14444'
    ];

    var expecteds = [
    'https://api.github.com/repos/rodrigomaia17/try_git/',
    'https://api.github.com/repos/rodrigomaia17/try_git./',
    'https://api.github.com/repos/rodrigomaia17/try_git2/',
    'https://api.github.com/repos/rodrigomaia17/try_2git/',
    'https://api.github.com/repos/rodrigomaia17/try_git./',
    'https://api.github.com/repos/rodrigomaia17/try_git-./',
    'https://api.github.com/repos/rodrigomaia17/-123123--.try_git.-2--/',
    'https://api.github.com/repos/pixelated-project/pixelated-user-agent/',
    'https://api.github.com/repos/pixelated-project/pixelated-dispatcher/',
    'https://api.github.com/repos/pixelated-project/project-issues/',
    'https://api.github.com/repos/pixelated-project/pixelated-platform/'
    ];

    for (var i = 0; i < urls.length; i++) {
      var expected = this.component.getRepoURLFromIssue(urls[i]);
      expect(expected).toBe(expecteds[i]);
    }

  });

});
