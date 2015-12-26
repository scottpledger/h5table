(function () {
  // Restore the h5table AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.h5table && jQuery.fn.h5table.amd) {
    var S2 = jQuery.fn.h5table.amd;
  }
