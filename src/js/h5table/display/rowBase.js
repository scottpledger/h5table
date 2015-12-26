define([
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function RowBase(parent, $parentContainers) {
		RowBase.__super__.constructor.call(this, parent, $parentContainer);

	}

	Utils.Extend(RowBase, Displayable);

	RowBase.prototype.init = function(row) {
		this.row = row;
	}

	RowBase.prototype.bind = function(core, $container) {
		RowBase.__super__.bind.call(this, core, $container);
	}

	RowBase.prototype.display = function(){

	}

	RowBase.prototype.destroy = function(){

	}

	return RowBase;
});