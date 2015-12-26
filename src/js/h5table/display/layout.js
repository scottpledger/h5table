define([
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function Layout(parent, $parentContainer) {
		Layout.__super__.constructor.call(this, parent, $parentContainer);

		this.$prefix = $('<div class="h5table-prefix"></div>');
		this.$table = $('<div class="h5table-table"></div>');
		this.$suffix = $('<div class="h5table-suffix"></div>');
		
		this.$parentContainer.append(this.$prefix, this.$table, this.$suffix);

		console.log('Layout::constructor', this);

		var layoutOpts = parent.options.get('layout');

		this.newChild(layoutOpts.prefix, this.$prefix);
		this.newChild(layoutOpts.table, this.$table);
		this.newChild(layoutOpts.suffix, this.$suffix);
	}

	Utils.Extend(Layout, Displayable);

	Layout.prototype.bind = function(core, $container) {
		Layout.__super__.bind.call(this, core, $container);
	}

	Layout.prototype.display = function(table) {

	}

	Layout.prototype.destroy = function(){

	}

	return Layout;
});