'use strict';
var nconf = require('nconf');

nconf.env().file('config.json');

var silentMode = false;

var get = function (key, callback) {
  var value = nconf.get(key);
  if (value) {
    if (callback) {
      callback(value);
    }
    return value || "";
  } else if (!silentMode) {
    console.log('[ERROR] Could not find ' + key + ' environment variable');
  }
};

var remove = function (key) {
  nconf.remove(key);
};

var set = function (key, val) {
  nconf.set(key, val);
};



module.exports = {
  remove: remove,
  set: set,
  get: get,
  setSilentMode: function (val) {
    silentMode = val;
  },
  reset: function () {
    nconf.reset();
  }

};