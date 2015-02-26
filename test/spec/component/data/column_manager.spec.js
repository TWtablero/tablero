describeComponent('component/data/columns_manager', function () {
  'use strict';

  it('first element priority should be next priority / 2 ', function () {
    var spy = spyOn(this.Component.prototype, 'get');
    this.setupComponent();
    this.component.retrieve();

    expect(spy).toHaveBeenCalled();
  });

});
