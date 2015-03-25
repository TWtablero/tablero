describeComponent('component/data/columns_manager', function () {

  'use strict';

  it('loads columns from server', function () {
    var deferred = $.Deferred();

    spyOn($, 'ajax').and.returnValue(deferred);

    var spyEvent = spyOnEvent(document, 'data:got:columns');

    this.setupComponent();
    this.component.retrieve();

    deferred.resolve();

    expect(spyEvent).toHaveBeenTriggeredOn(document);
  });

});
