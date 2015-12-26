define([
  'jquery',
  'jquery-mousewheel',

  './h5table/core',
  './h5table/defaults'
], function ($, _, h5table, Defaults) {
  if ($.fn.h5table == null) {
    // All methods that should return the element
    var thisMethods = ['destroy'];

    $.fn.h5table = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);
          var $this = $(this);
          var instance = new h5table($this, instanceOptions);
          $this.data('h5table', instance);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;

        this.each(function () {
          var instance = $(this).data('h5table');

          if (instance == null && window.console && console.error) {
            console.error(
              'The h5table(\'' + options + '\') method was called on an ' +
              'element that is not using h5table.'
            );
          }

          var args = Array.prototype.slice.call(arguments, 1);

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if ($.inArray(options, thisMethods) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for h5table: ' + options);
      }
    };
  }

  if ($.fn.h5table.defaults == null) {
    $.fn.h5table.defaults = Defaults;
  }

  return h5table;
});
