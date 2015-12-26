define([
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function PrefixBase(parent, $parentContainer) {
		PrefixBase.__super__.constructor.call(this, parent, $parentContainer);
	}

	Utils.Extend(PrefixBase, Displayable);

	PrefixBase.prototype.bind = function(core, $container) {
		PrefixBase.__super__.bind.call(this, core, $container);
	}

	PrefixBase.prototype.display = function(){

	}

	PrefixBase.prototype.destroy = function(){

	}

	return PrefixBase;
});