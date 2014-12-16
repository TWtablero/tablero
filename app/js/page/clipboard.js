define([], function () {
  $(document).keydown(function(e) {
    var _ref, _ref2;
    if (!this.value || !(e.ctrlKey || e.metaKey)) {
      return;
    }
    if ($(e.target).is("input:visible,textarea:visible")) {
      return;
    }
    if (typeof window.getSelection === "function" ? (_ref = window.getSelection()) != null ? _ref.toString() : void 0 : void 0) {
      return;
    }
    if ((_ref2 = document.selection) != null ? _ref2.createRange().text : void 0) {
      return;
    }
  }, this);
  $(document).keyup(function(e) {
    if ($(e.target).is("#clipboard")) {
      return $("#clipboard").text('');
    }
  });
});