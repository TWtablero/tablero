describeComponent('component/data/github_issues', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
  });

  describe('createIssue', function() {
    var issues = {
      data: {
        projectName: "lala",
        issueTitle: "Best issue",
        issueBody: "iojfioadas"
      }
    };

    it('If it is able to create an issue on GitHub, trigger ui:add:issue', function(){
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.success('');
      });
      var spyEvent = spyOnEvent(document, "ui:add:issue");

      this.component.trigger('ui:create:issue', issues);

      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });

    it('If it is not able to create issue on GitHub, show error', function(){
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.error('');
      });
      var errorEvent = spyOnEvent(document, "ui:show:messageFailConnection")

      this.component.trigger('ui:create:issue', issues);

      expect(errorEvent).toHaveBeenTriggeredOn(document);
    });
  });

  describe('prepareAllIssues', function() {
    var issue, issues, pullRequest;

    beforeEach(function () {
      pullRequest = {
        pull_request: true
      };
      issue = {
        url: 'https://api.github.com/repos/rodrigomaia17/try_git/issues/1'
      };

      issues = [pullRequest, issue];
    });

    it('should not add pull request issues', function() {
      expect(this.component.prepareAllIssues(issues, 'project1')).not.toContain(pullRequest);
    });

    it('should contain issue', function() {
      expect(this.component.prepareAllIssues(issues, 'project2')).toContain(issue);
    });

    it('should have the projectName attribute', function() {
      expect(this.component.prepareAllIssues(issues, 'project3')[0].projectName).toBe('project3');  
    });

    it('should call getRepoURLFromIssue', function() {
      expect(this.component.prepareAllIssues(issues, 'project3')[0].repoUrl).toBeTruthy();
    });
  });

  describe("addIssue", function () {
    it('trigger event data:issues:refreshed with the expected params', function () {
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

  describe('getRepoURLFromIssue', function() {
    it('getRepoURLFromIssue should return repository url from all url types', function () {
      var issueUrls = [
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
        'https://api.github.com/repos/pixelated-project/pixelated-platform/issues/14444',
        undefined
      ];

      var repositoryUrl = [
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
        'https://api.github.com/repos/pixelated-project/pixelated-platform/',
        undefined
      ];

      for (var i = 0; i < issueUrls.length; i++) {
        var expected = this.component.getRepoURLFromIssue(issueUrls[i]);
        expect(expected).toBe(repositoryUrl[i]);
      }
    });
  });

  describe('loadAndPrioritizeAllIssues', function() {
    var readRequest;

    it('should trigger blockUI event', function() {
      var spyEvent = spyOnEvent(document, 'ui:blockUI');
      this.component.loadAndPrioritizeAllIssues();
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });

    it('should call fetchAllIssues once per repository', function() {
      this.component.attr.repositories = ['repotest1', 'repotest2'];
      spyOn(this.component, 'fetchAllIssues');
      this.component.loadAndPrioritizeAllIssues();
      expect(this.component.fetchAllIssues.calls.count()).toEqual(2);
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
  });

  describe('addIssuesToBoard', function(){
    var spyPrepareAllIssues;
    var sampleObject;

    beforeEach(function(){
      sampleObject = {name: 'Otavio'}
      spyPrepareAllIssues = spyOn(this.component, 'prepareAllIssues').and.returnValue([sampleObject]);
    });

    it('should call prepareAllIssues', function(){
      this.component.addIssuesToBoard({}, '');
      expect(spyPrepareAllIssues).toHaveBeenCalled();
    });

    it('shouldAdd sampleObject to issues', function(){
      this.component.addIssuesToBoard({}, '');
      expect(this.component.attr.issues).toContain(sampleObject);
    });

    it('should trigger data:issues:refreshed', function(){
      var spyEvent = spyOnEvent(document, 'data:issues:refreshed');
      this.component.addIssuesToBoard({}, '');
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });

    it('should trigger ui:needs:priority', function(){
      var spyEvent = spyOnEvent(document, 'ui:needs:priority');
      this.component.addIssuesToBoard({}, '');
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });
  });

  describe('getIssueUrlFromElement', function() {
    it('should return expected URL', function() {
      var actualUrl = "http://github.com/lalala"
      var element = $('<div><div><a href="' + actualUrl + '"/></div></div>')[0];

      var resultUrl = this.component.getIssueUrlFromElement(element);

      expect(resultUrl).toBe('http://api.github.com/repos/lalala')
    })
  });

  describe('getAccessTokenParam', function () {
    it('should return access_token param and value', function() {
      spyOn(this.component, 'getCurrentAuthToken').and.returnValue('0201fc4dee77f5e0453b350549926f25de403904');

      var result = this.component.getAccessTokenParam();

      expect(result).toBe('?access_token=0201fc4dee77f5e0453b350549926f25de403904');
    });
  });

  describe('changeNewIssueLink', function() {
    it('should return the right link for a new issue given the project name.', function(){
      var sampleUrl ='http://www.github.com/twtablero/repotest1/issues/new';
      this.setupComponent('<a class="link"></a>', {});
      spyOn(this.component, 'newIssueURL').and.returnValue(sampleUrl);

      this.component.changeNewIssueLink({}, 'repotest1');

      expect($(document).find(".link").attr('href')).toBe(sampleUrl);
    });
  });

  describe('mountExportClick', function() {
    it('should trigger event with the issues from the component', function() {
      var eventSpy = spyOnEvent(document, "data:issues:mountExportCsvLink");
      this.component.attr.issues = ['issue1', 'issue2'];
      this.component.mountExportClick();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual({ issues: ['issue1', 'issue2'] });

    });
  });

  describe('clearIssues', function() {
    it('should clear attribute issues from component', function() {
      this.component.attr.issues = ['issue1', 'issue2'];
      this.component.clearIssues();

      expect(this.component.attr.issues.length).toBe(0);
    });
  });

  describe('assignMyselfToIssue', function() {
    it('should return nothing if data is falsy.', function() {
      var result = this.component.assignMyselfToIssue({}, undefined);
      expect(result).toBe(undefined);
    });

    it('should return nothing if attribute issue is falsy', function() {
      var data = {user: 'ddetoni', issue: undefined};

      var result = this.component.assignMyselfToIssue({}, data);
      expect(result).toBe(undefined);
    });

    it('should call ui:needs:githubUser when the user is not logged in', function(){
      var data = {user: undefined, issue: {}};
      var spyEvent = spyOnEvent(document, 'ui:needs:githubUser');

      var result = this.component.assignMyselfToIssue({}, data);

      expect(spyEvent).toHaveBeenTriggeredOn(document);
      expect(result).toBe(undefined);
    });

    it('should trigger ui:unassign:user if the user is assigned to the issue', function() {
      var issue = $(' \
        <div id="1234567"> \
          <span class="empty-avatar" style="display: none;"></span> \
          <img class="assignee-avatar" title="ddetoni"/> \
        </div>');
      $('body').append(issue);

      var data = {user: {login: 'ddetoni'}, issue: {id: '1234567'}};
      var spyEvent = spyOnEvent(document, 'ui:unassign:user');

      var result = this.component.assignMyselfToIssue({}, data);

      expect(spyEvent).toHaveBeenTriggeredOn(document);
      expect(result).toBe(undefined);
    });

    it('should make unassign window disappear if it exists.', function() {
      var issue = $(' \
        <div id="1234568"> \
          <div class="issue-header"> \
            <div class="popover"></div> \
          </div> \
          <span class="empty-avatar" style="display: none;"></span> \
          <img class="assignee-avatar" title="ddetoni"/> \
        </div>');
      $('body').append(issue);
      var data = {user: {login: 'OtavioRMachado'}, issue: {id: '1234568'}};

      var result = this.component.assignMyselfToIssue({}, data);
      var issue_header = $('#' + '1234568' + ' .issue-header');
      expect(issue_header.children('.popover').length).toBe(0);
      expect(result).toBe(undefined);
    });

    it('should make unassign window appear', function() {
      var issue = $(' \
        <div id="1234569"> \
          <div class="issue-header"> </div> \
          <span class="empty-avatar" style="display: none;"></span> \
          <img class="assignee-avatar" title="ddetoni"/> \
        </div>');
      $('body').append(issue);
      var data = {user: {login: 'OtavioRMachado'}, issue: {id: '1234569'}};

      var result = this.component.assignMyselfToIssue({}, data);
      var issue_header = $('#' + '1234569' + ' .issue-header');
      expect(issue_header.children('.popover').length).toBe(1);
    });

    it('should assign myself to issue', function(){
      var issue = $(' \
        <div id="1234570"> \
          <div class="issue-header"> \
            <a class="assigns-myself"/> \
          </div> \
          <span class="empty-avatar" style="display: block;"></span> \
        </div>');
      $('body').append(issue);
      var data = {user: {login: 'OtavioRMachado'}, issue: {id: '1234570'}};

      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.success('');
      });

      var result = this.component.assignMyselfToIssue({}, data);
      var assignedIssue = $('#1234570 .assigned');

      expect(assignedIssue.length).toBe(1);
    });

    it('should show empty avatar label', function(){
      var issue = $(' \
        <div id="1234571"> \
          <div class="issue-header"> \
            <a class="assigns-myself"> \
              <span class="empty-avatar" style="display: block;"></span> \
              <span class="empty-avatar-label"></span> \
            </a> \
          </div> \
        </div>');
      $('body').append(issue);
      var data = {user: {login: 'OtavioRMachado'}, issue: {id: '1234571'}};

      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.error('');
      });

      var result = this.component.assignMyselfToIssue({}, data);
      var emptyLabelIssue = $('#1234571 .empty-avatar-label');

      expect(emptyLabelIssue.css('display')).not.toBe('none');
    });
  });

  describe('unassignMyselfToIssue', function() {
    var issue, data;
    beforeEach(function() {
      var issue = $(' \
        <div id="1234574"> \
          <div class="issue-header"> \
            <a class="assigns-myself assigned"> \
              <span class="empty-avatar" style="display: none;"></span> \
              <span class="empty-avatar-label"></span> \
              <img class="assignee-avatar" title="OtavioRMachado" src="http://github.avatar.com"> \
            </a> \
          </div> \
        </div>');
      $('body').append(issue);
      data = {user: {login: 'OtavioRMachado'}, issue: {id: '1234574'}};
    });

    afterEach(function(){
      $('#1234574').remove();
    });

    it('should show empty avatar when success unassign', function() {
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.success('');
      });

      this.component.unassignMyselfToIssue({}, data);
      var emptyAvatarIssue = $('#1234574 .empty-avatar');
      var emptyAvatarLabelIssue = $('#1234574 .empty-avatar-label');

      expect(emptyAvatarIssue.css('display')).not.toBe('none');
      expect(emptyAvatarLabelIssue.css('display')).not.toBe('none');
    });

    it('issue should not be of class .assigned when success unassign', function(){
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.success('');
      });

      this.component.unassignMyselfToIssue({}, data);
      var assignMyselfIssue = $('#1234574 .assigns-myself');

      expect(assignMyselfIssue.hasClass('assigned')).toBe(false);
    });

    it('issue keeps current person assigned when ajax returns an error', function() {
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.error('');
      });

      this.component.unassignMyselfToIssue({}, data);
      var assigneeAvatar = $('#1234574 .assignee-avatar');
      expect(assigneeAvatar.attr('src')).toBe('http://github.avatar.com');
      expect(assigneeAvatar.attr('title')).toBe('OtavioRMachado');
    });

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
});