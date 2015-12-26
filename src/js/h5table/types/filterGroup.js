define([
], function(){
	function FilterGroup(type, filters) {
		this.type = arguments.length>0?type:FilterGroup.Types.and;
		Array.prototype.push.apply(this, (arguments.length>1?filters:[]));
	}

	FilterGroup.Types = {
		'and': function(item) {
			if(!(this.length>0))
				throw new Error('You cannot apply "and" to zero items.');
			for(var i = 0; i < this.length; i++){
				if(!this[i].matches(item))
					return false;
			}
			return true;
		},
		'or': function(item) {
			if(!(this.length>0))
				throw new Error('You cannot apply "or" to zero items.');
			for (var i = 0; i < this.length; i++) {
				if(this[i].matches(item))
					return true;
			}
			return false;
		},
		'xor': function(item) {
			if(!(this.length===2))
				throw new Error('You can only apply "xor" to exactly 2 items.');
			var aMatches = this[0].matches(item);
			var bMatches = this[1].matches(item);
			return ((aMatches && !bMatches) || (!aMatches && bMatches));
		}
	};

	FilterGroup.lookupType = function(type) {
		for(var key in FilterGroup.Types) {
			if(type == key || type==FilterGroup.Types[key])
				return key;
		}
		throw new Error('"'+type+'" is not a valid filter group type.');
	}

	FilterGroup.prototype = new Array();

	var FilterGroupType = Symbol('type');
	Object.defineProperty(FilterGroup.prototype, 'type', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[FilterGroupType];
		},
		set: function(val){
			this[FilterGroupType] = FilterGroup.lookupType(val);
		}
	});

	FilterGroup.prototype.push = function(){
		if(this.type==FilterGroup.Types.xor && this.length + arguments.length != 2){
			throw new Error('Xor FilterGroups must have exactly 2 items!');
		}
		Array.prototype.push.apply(this, Array.prototype.slice.apply(arguments));
	}

	FilterGroup.prototype.concat = function(values){
		return new FilterGroup(this.type, Array.prototype.concat.call(this, values));
	}

	FilterGroup.prototype.and = function() {
		var filters = Array.prototype.slice.apply(arguments);
		if(this.type===FilterGroup.types.and) {
			return this.concat(filters);
		} else {
			return new FilterGroup(FilterGroup.Types.and, [this].concat(filters));
		}
	}

	FilterGroup.prototype.or = function() {
		var filters = Array.prototype.slice.apply(arguments);
		if (this.type===FilterGroup.types.or) {
			return this.concat(filters);
		} else {
			return new FilterGroup(FilterGroup.Types.or, [this].concat(filters));
		}
	}

	FilterGroup.prototype.xor = function(other) {
		return new FilterGroup(FilterGroup.Types.xor, [this, other]);
	}

	FilterGroup.prototype.matches = function(row) {
		return this.type.apply(this, row);
	}

	FilterGroup.prototype.filter = function(rows) {
		var self = this;
		return rows.filter(function(row, index, arr){
			return self.matches(row);
		});
	}

	return FilterGroup;
})