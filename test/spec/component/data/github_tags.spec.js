describeComponent('component/data/github_tags', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
  });

  describe('get tags', function(){
	  it('parses tag names from github response', function() {
	  	spyOn(this.component, 'getAllTagsFromProjects').and.returnValue(
	  		[[{name: 'bug'}], "success", "ok"]);
	  	spyOn(this.component, 'addTags');

	  	this.component.getProjectTags();

	  	expect(this.component.attr.tags).toContain('bug');
	  });
  });

});