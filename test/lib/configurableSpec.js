var mockery = require('mockery');

describe("Configurable", function() {
  var configurable = require('../../lib/configurable');
  var value = 'VALUE',
    key = 'KEY',
    callback;

  beforeEach(function() {
    callback = jasmine.createSpy('callback');
  })
  afterEach(function() {
    process.env[key] = undefined;
  });

  describe("Get", function() {

    describe('when value does not exist', function() {
      it("returns undefined", function() {
        var actual = configurable.get(key, callback);

        expect(callback).not.toHaveBeenCalledWith(value);
        expect(actual).toBe(undefined);
      });
    });

    describe('when value exists', function() {
      it("executes callback", function() {
        process.env[key] = value;

        var actual = configurable.get(key, callback);

        expect(callback).toHaveBeenCalledWith(value);
        expect(actual).toBe(value);
      });

    });
  });

  describe("Verify", function() {
    var configurable,
      questions,
      promptMock;
    beforeEach(function() {
      promptMock = jasmine.createSpy('prompt mock');

      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });

      mockery.registerMock('inquirer', {
        prompt: promptMock
      });
      questions = [{
        key: key,
        description: 'Description'
      }];

      configurable = require('../../lib/configurable')
    });
    afterEach(function() {
      mockery.disable();
    });


    describe('when values is not set', function() {
      beforeEach(function() {
        process.stdout.isTTY = true;
      });

      it('prompts for value', function() {
        configurable.verify(questions, callback);

        expect(promptMock).toHaveBeenCalled();
        var args = promptMock.argsForCall[0][0][0];
        expect(args.type).toBe('input');
        expect(args.name).toBe(key);
        expect(args.message).toMatch(/Description/);
      });

      it('requires mandatory values', function() {
        configurable.verify(questions, callback);

        expect(promptMock).toHaveBeenCalled();
        var args = promptMock.argsForCall[0][0][0];
        var validateFunction = args.validate;

        expect(validateFunction()).toBeFalsy();
        expect(validateFunction(value)).toBeTruthy();
      })

      it('allows optional values', function() {
        questions[0].optional = true;
        configurable.verify(questions, callback);

        expect(promptMock).toHaveBeenCalled();
        var args = promptMock.argsForCall[0][0][0];
        var validateFunction = args.validate;

        expect(validateFunction()).toBeTruthy();
      })
    });

    describe('when non TTY', function() {
      it('no questions', function() {
        process.stdout.isTTY = false;

        configurable.verify(questions, callback);

        expect(promptMock).toHaveBeenCalledWith([], callback);
      });
    });

    describe('when values is set', function() {
      it('executes with no questions', function() {
        process.env[key] = value;

        configurable.verify(questions, callback);

        expect(promptMock).toHaveBeenCalledWith([], callback);
      });
    });
  });
});
