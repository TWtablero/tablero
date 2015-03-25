describeComponent('component/data/github_tags', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
  });

  describe('get tags', function(){
	  it('retrieves tag names from github response for multiple repos', function() {
	  	spyOn(this.component, 'getAllTagsFromProjects').and.returnValue(
	  		[[[{name: 'bug'}], "success", "ok"], [[{name: 'story'}], "success", "ok"]]);
	  	spyOn(this.component, 'addTags');

	  	this.component.getProjectTags();

	  	expect(this.component.attr.tags).toContain('bug');
	  	expect(this.component.attr.tags).toContain('story');
	  });

	  it('retrieves tag names for one repo', function() {
	  	spyOn(this.component, 'getAllTagsFromProjects').and.returnValue(
	  		[[{name: 'new'}, "success", "ok"]]);
	  	spyOn(this.component, 'addTags');

	  	this.component.getProjectTags();

	  	expect(this.component.attr.tags).toContain('new');
	  });
  });

});