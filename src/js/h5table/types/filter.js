define([
], function(){
	function Filter(value, type, fields, matchOn) {
		this.value = value;
		this.type = arguments.length>1?type:Filter.defaults.type;
		this.fields = arguments.length>2?fields:Filter.defaults.fields;
		this.matchOn = arguments.length>3?matchOn:Filter.defaults.matchOn;
	}

	Filter.MatchOns = {
		AllFields: function(values){
			for(var i = 0; i<values.length; i++){
				if(!this.type.call(this, values[i]))
					return false;
			}
			return true;
		},
		AnyFields: function(values){
			for(var i = 0; i<values.length; i++){
				if(this.type.call(this, values[i]))
					return true;
			}
			return false;
		}
	};

	Filter.Types = {
		Equals: function(value){
			return value == this.value;
		},
		NotEquals: function(value){
			return value != this.value;
		},
		EqualsIgnoreCase: function(value){
			return value.toLowerCase() == this.value.toLowerCase();
		},
		NotEqualsIgnoreCase: function(value){
			return value.toLowerCase() != this.value.toLowerCase();
		},
		Contains: function(value){
			return value.indexOf(this.value) != -1;
		},
		NotContains: function(value){
			return value.indexOf(this.value) == -1;
		},
		ContainsIgnoreCase: function(value){
			return value.toLowerCase().indexOf(this.value.toLowerCase()) != -1;
		},
		NotContainsIgnoreCase: function(value){
			return value.toLowerCase().indexOf(this.value.toLowerCase()) == -1;
		},
		LessThan: function(value){
			return value < this.value;
		},
		NotLessThan: function(value){
			return value >= this.value;
		},
		GreaterThan: function(value){
			return value > this.value;
		},
		NotGreaterThan: function(value){
			return value <= this.value;
		},
		IsNull: function(value){
			return value == null;
		},
		NotIsNull: function(value){
			return value != null;
		},
		IsBetween: function(value){
			if(!Array.isArray(this.value) || this.value.length!=2)
				throw new Error('Cannot use "IsBetween" with '+this.value+'.  The Filter value must be an array of length=2.');
			return this.value[0] <= value && value <= this.value[1];
		},
		NotIsBetween: function(value){
			if(!Array.isArray(this.value) || this.value.length!=2)
				throw new Error('Cannot use "IsBetween" with '+this.value+'.  The Filter value must be an array of length=2.');
			return this.value[0] >  value || value > this.value[1];
		},
		Custom: function(value){
			return this.value(value);
		},
		NotCustom: function(value){
			return !this.value(value);
		}
	};

	Filter.TypeLookups = {
		'=': Filter.Types.Equals,
		'!=': Filter.Types.NotEquals,
		'=~': Filter.Types.EqualsIgnoreCase,
		'!=~': Filter.Types.NotEqualsIgnoreCase,
		'~': Filter.Types.Contains,
		'!~': Filter.Types.NotContains,
		'~~': Filter.Types.ContainsIgnoreCase,
		'!~~': Filter.Types.NotContainsIgnoreCase,
		'<': Filter.Types.LessThan,
		'>=': Filter.Types.NotLessThan,
		'>': Filter.Types.GreaterThan,
		'<=': Filter.Types.NotGreaterThan,
		'=|': Filter.Types.IsNull,
		'!=|': Filter.Types.NotIsNull
	};

	Filter.defaults = {
		matchOn: Filter.MatchOns.AnyFields,
		type: Filter.Types.Equals,
		fields: null
	};

	Filter.lookupMatch(match) {
		for(var key in Filter.MatchOns) {
			if(match == key || match==Filter.MatchOns[key])
				return key;
		}
		throw new Error('"'+type+'" is not a valid filter matching strategy.');
	}

	Filter.lookupType(type) {
		if(Filter.Types[type])
			return Filter.Types[type];
		if(Filter.TypeLookups[type])
			return Filter.TypeLookups[type];
		
		throw new Error('"'+type+'" is not a valid filter type.');
	}

	var FilterType = Symbol('type');
	Object.defineProperty(Filter.prototype, 'type', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[FilterType];
		},
		set: function(val){
			this[FilterType] = Filter.lookupType(val);
		}
	});

	var FilterMatchOn = Symbol('matchOn');
	Object.defineProperty(Filter.prototype, 'matchOn', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[FilterMatchOn];
		},
		set: function(val){
			this[FilterMatchOn] = Filter.lookupMatch(val);
		}
	});

	Filter.prototype.matches = function(row) {

		var values = this.fields == null ? row.getAllValues() : row.lookupValues(this.fields);

		return this.matchOn.call(this, row, values);

	}

	Filter.prototype.filter = function(rows) {
		var self = this;
		return rows.filter(function(row, index, arr){
			return self.matches(row);
		});
	}

	return Filter;
})