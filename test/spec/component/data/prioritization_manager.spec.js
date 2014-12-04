describeComponent('component/data/prioritization_manager', function () {
  'use strict';
  beforeEach(function () {
    this.setupComponent();
  });

  
  it('first element priority should be next priority / 2 ', function () {
    var spyEvent = spyOnEvent(document, 'data:issue:priorityChanged');

    var params = { 
                    element : { priority : 5 } ,
                    nextElement : { priority : 1},
                    previousElement : { priority : 0}
                };

    this.component.changePriority(null,params);


    expect(spyEvent).toHaveBeenTriggeredOnAndWith(document, { priority : 0.5});


  });

    it('last element priority should be previous priority + 1 ', function () {
    var spyEvent = spyOnEvent(document, 'data:issue:priorityChanged');

    var params = { 
                    element : { priority : 5 } ,
                    previousElement : { priority : 1},
                    nextElement : { priority : 0}
                };

    this.component.changePriority(null,params);


    expect(spyEvent).toHaveBeenTriggeredOnAndWith(document, { priority : 2});

  });
  
});
