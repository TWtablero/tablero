var mockery = require('mockery');
var nconf = require('nconf');


describe("Configurable", function() {
  var configurable = require('../../lib/configurable');

  var value = 'VALUE',
    key = 'KEY',
    callback;

  beforeEach(function() {
    callback = jasmine.createSpy('callback');
  })
  afterEach(function() {
    nconf.remove(key);
  });

  describe("Get", function() {

    describe('when value does not exist', function() {
      it("returns undefined", function() {
        configurable.setSilentMode(true);
        var actual = configurable.get(key, callback);

        expect(callback).not.toHaveBeenCalledWith(value);
        expect(actual).toBe(undefined);
      });
    });

    describe('when value exists', function() {
      it("executes callback", function() {
        nconf.set(key,value);

        var actual = configurable.get(key, callback);

        expect(callback).toHaveBeenCalledWith(value);
        expect(actual).toBe(value);
      });

    });
  });

});
