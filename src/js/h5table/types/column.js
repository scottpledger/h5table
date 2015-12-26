define([
	'jquery'
],function($){
	function Column(table, data) {
		var _data = $.extend({}, data);

		$.extend(true, this, Column.defaults, _data);

		this._table = table;
	}

	Column.defaults = {
		title: null,
		field: null,
		children: [],
		_parent: null,
		_table: null
	};

	Column.FieldRegex = /^(?:[^.\[\]]+(?:\[\s*\d+\s*\])*)(?:.[^.\[\]]+(?:\[\s*\d+\s*\])*)*$/;
	Column.FieldSegmentRegex = /^(?:([^.\[\]]+)|\[\s*(\d+)\s*\]).?/;

	var FieldSym = Symbol('field');
	Object.defineProperty(Column.prototype, 'field', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[FieldSym] || this.title;
		},
		set: function(val) {
			if(!Column.FieldRegex.test(val))
				throw new Error('"'+val+'" is not a valid field name.');
			this[FieldSym] = val;
		}
	});

	var ChildSym = Symbol('children');
	Object.defineProperty(Column.prototype, 'children', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[ChildSym] || [];
		},
		set: function(val){
			val = (!val?[]:val); // Anything false-y becomes a blank array.
			if(!Array.isArray(val))
				throw new Error('Cannot set child columns to '+val);
			this[ChildSym] = val;

			var self = this;
			val.map(function(child){
				child._parent = self;
			});
		}
	});

	Column.prototype.getSpan = function() {
		var span = 1;
		if ( this.children.length>0 ) {
			span = 0;
			for (var i=0; i < this.children.length; i++) {
				span += this.children[i].getSpan();
			}
		}
		return span;
	};

	Column.prototype.addColumns = function(cols) {

		if(!$.isArray(cols)){
			cols = Array.prototype.slice.apply(arguments);
		}
		this.children = this.children.concat(cols);

	};
	Column.prototype.addColumn = Column.prototype.addColumns;

	Column.prototype.flatten = function(){
		return [this].concat(this.children.map(function(col){
			return col.flatten();
		}));
	};

	return Column;
});