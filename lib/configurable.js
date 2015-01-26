var inquirer = require("inquirer");
var _ = require('underscore');
var env = process.env;

var get = function(key, callback) {
  var value = env[key];
  if (value) {
    if (callback) {
      callback(value);
    }
    return value;
  } else {
    console.log('[ERROR] Could not find ' + key + ' environment variable');
  }
};

var verify = function(properties, callback) {
  var questions = _(properties).
    filter(function(_) { return process.stdout.isTTY; }).
    filter(function(prop) {return get(prop.key) === 'undefined'; }).
    map(function(prop) {

      return {
        type: 'input',
        name: prop.key,
        message: 'Enter ' + prop.description + ':',
        validate: function(input) {
          if (input) {
            env[prop.key] = input;
            return true;
          }
          return false || prop.optional == true;
        }
      };
  });

  inquirer.prompt(questions, callback);
}

module.exports = {
  get: get,
  verify: verify
};
