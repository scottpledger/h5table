define([
  'jquery',
  '../utils',
  './displayable',
  './columnBase',
  './rowBase',
  './cellBase'
], function ($, Utils, Displayable, ColumnBase, RowBase, CellBase) {
	function TableBase(parent, $parentContainer) {
		TableBase.__super__.constructor.call(this, parent, $parentContainer);

		this.core = this.getCore();
		var tableClass = this.core.options.get('tableClass');
		this.$header = $(
			'<div class="h5table-header">' +
				'<div class="h5table-pinned">' +
					'<table class="'+tableClass+'">' +
						'<thead></thead>' +
					'</table>' +
				'</div>' +
				'<div class="h5table-viewport">' +
					'<div class="h5table-container">' +
						'<table class="'+tableClass+'">' +
							'<thead></thead>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>');
		this.$body = $(
			'<div class="h5table-body">' +
				'<div class="h5table-pinned">' +
					'<table class="'+tableClass+'">' +
						'<tbody></tbody>' +
					'</table>' +
				'</div>' +
				'<div class="h5table-viewport">' +
					'<div class="h5table-container">' +
						'<table class="'+tableClass+'">' +
							'<tbody></tbody>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>');
		this.$pinnedHeader = this.$header.find('.h5table-pinned thead');
		this.$regularHeader = this.$header.find('.h5table-viewport .h5table-container thead');

		this.$pinnedBody = this.$body.find('.h5table-pinned tbody');
		this.$regularBody = this.$body.find('.h5table-viewport .h5table-container tbody');

		this.$parentContainer.append(this.$header, this.$body);
	}

	Utils.Extend(TableBase, Displayable);

	TableBase.prototype.bind = function(core, $container) {
		TableBase.__super__.bind.call(this, core, $container);
		console.log('TableBase::bind', this, arguments);
		var self = this;

		core.on('query:updated', function(params){
			console.log('TableBase::bind(query.updated)', arguments);
		});
		core.on('pagination:updated', function(params){
			console.log('TableBase::bind(pagination.updated)', arguments);
		});
		core.on('meta:updated', function(params){
			self.updateMeta(params.table);
		});
		core.on('page:updated', function(params){
			self.updatePage(params.data, params.query);
		});
	}

	var ColumnEl = Symbol('$columnEl');

	TableBase.prototype.updateMeta = function(table){
		console.log('TableBase::updateMeta', arguments);
		var self = this;

		this.table = table;

		table.columns.map(function(col, ind, cols){
			var colEl = col[ColumnEl];
			var $to = col.pinned ? self.$pinnedHeader : self.$regularHeader;

			if(!colEl){
				colEl = self.newChild(ColumnBase, $to, [col], '_columns');
				col[ColumnEl] = colEl;
			}
			
			return colEl;
		});

		this.$body.css('paddingTop',this.$header.height());
	}

	TableBase.prototype.updatePage = function(data, query){
		console.log('TableBase::updatePage', arguments);
		

		var cols = this.table.columns;
		data.map(function(row, index, rows){

		});
	}

	TableBase.prototype.display = function(table, data, query){
		console.log('TableBase::display', arguments);
	}

	TableBase.prototype.destroy = function(){

	}

	return TableBase;
});