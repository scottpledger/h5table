define([
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function CellBase(parent, $parentContainer) {
		CellBase.__super__.constructor.call(this, parent, $parentContainer);
	}

	Utils.Extend(CellBase, Displayable);

	CellBase.prototype.init = function(row, column) {
		
	}

	CellBase.prototype.bind = function(core, $container) {
		CellBase.__super__.bind.call(this, core, $container);
	}

	CellBase.prototype.display = function(){

	}

	CellBase.prototype.destroy = function(){

	}

	return CellBase;
});