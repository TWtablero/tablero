define(['clipboard'],
  function (clipboard) {
    return copyable;

    function copyable() {
      this.makeCopyable = function (evt) {
        $('.title').tipsy({
          delayIn: 1000,
          delayOut: 0,
          title: 'data-hint'
        });
        $('.issue').hover(function () {
          var toCopy = $('.title', this).text();
          $(clipboard.hidden).text(toCopy).focus().select();
        }, function () {
          $(clipboard.hidden).text('').empty();
        });
      }
    }
  });