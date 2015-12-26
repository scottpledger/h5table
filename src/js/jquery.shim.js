/* global jQuery:false, $:false */
define(function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'h5table: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before h5table on your ' +
      'web page.'
    );
  }

  return _$;
});
