define([
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function ColumnBase(parent, $parentContainer) {
		ColumnBase.__super__.constructor.call(this, parent, $parentContainer);

		this.$cell = $('<th class="h5table-column"><span></span><div class="h5table-children"></div></th>');
		this.$label = this.$cell.find('span');
		this.$children = this.$cell.find('.h5table-children');
		this.$parentContainer.append(this.$cell);
	}

	Utils.Extend(ColumnBase, Displayable);

	ColumnBase.prototype.init = function(col) {
		console.log('init');
		this._col = col;
		this.$label.text(this._col.title);

		for(var i = 0; i < this._col.children.length; i++){
			this.newChild(ColumnBase, this.$children, [this._col.children[i]]);
		}
	}

	ColumnBase.prototype.bind = function(core, $container) {
		ColumnBase.__super__.bind.call(this, core, $container);
	}

	ColumnBase.prototype.display = function(){

	}

	ColumnBase.prototype.destroy = function(){

	}

	return ColumnBase;
});