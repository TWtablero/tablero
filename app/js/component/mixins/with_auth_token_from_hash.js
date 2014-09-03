define([],
  function () {
    return function () {
      this.getCurrentAuthToken = function () {
        return window.location.hash.slice(1);
      };
    }
  }
);
