define([
], function(){

	function SortOrder(column, direction){
		this.column = column;
		this.direction = direction || SortOrder.Directions.Asc;
	}

	SortOrder.Directions = {
		'Asc': function(value1, value2) {
			return value1<value2 ? -1 : (value1>value2 ? 1 : 0);
		},
		'Desc': function(value1, value2) {
			return value1<value2 ? 1 : (value1>value2 ? -1 : 0);
		}
	};

	SortOrder.lookupDirection = function(dir) {
		for(var key in SortOrder.Directions) {
			if(dir==SortOrder.Directions[key] || dir.toLowerCase() == key.toLowerCase())
				return key;
		}
		throw new Error('"'+dir+'" is not a valid sort order direction.');
	}

	FilterGroup.prototype = new Array();

	var SortOrderDirection = Symbol('direction');
	Object.defineProperty(FilterGroup.prototype, 'direction', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[SortOrderDirection];
		},
		set: function(val){
			this[SortOrderDirection] = SortOrder.lookupDirection(val);
		}
	});

	SortOrder.prototype.compare = function(row1, row2){
		var value1 = row1.lookupValue(this.column),
			value2 = row2.lookupValue(this.column);
		return this.direction(value1, value2);
	}

	return SortOrder;
})