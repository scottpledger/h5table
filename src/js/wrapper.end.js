  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var h5table = S2.require('jquery.h5table');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows h5table to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.h5table.amd = S2;

  // Return the h5table instance for anyone who is importing it.
  return h5table;
}));
