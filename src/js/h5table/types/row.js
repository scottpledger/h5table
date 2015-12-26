define([
	'./column'
],function(Column, undefined){
	function Row(table, data) {
		this.table = table;
		this.data = data;
		this.children = [];
	}

	Row.prototype.setValue = function(column, value) {
		if(typeof column!=='string')
			column = column.field;
		if(!Column.FieldRegex.test(column))
			throw new Error('"'+column+'" is not a valid field name.')
		
		var parent = this.data,
		    i = 0,
		    fieldName = column;
		while(i < column.length){
			fieldName = column.slice(i);
			if(parent[fieldName]!=undefined){
				parent[fieldName] = value;
				return;
			}

			var fieldMatches = fieldName.match(Column.FieldSegmentRegex);
			if(fieldMatches==null)
				throw new Error('"'+column+'" is not a valid field name.  There is something wrong at position '+i+'.');

			var i1 = i+fieldMatches[0].length,
			    fieldName = fieldMatches[1] || fieldMatches[2];

			if(i1>=column.length){
				// this is last segment.  set it.
				parent[fieldName] = value;
				return;
			}
			
			if(parent[fieldName]==undefined)
				parent[fieldName] = {};
			parent = parent[fieldName];
			i=i1;

		}
		throw new Error('Could not set value '+value+' on column '+column);
	}

	Row.prototype.lookupValue = function(column) {
		if(typeof column!=='string')
			column = column.field;
		var fieldName = column;
		var fieldSegs = [];
		var obj = this.data;
		var seg = '';
		var segType = 'a property';  // 'a property' or 'an index'
		var i0 = 0;
		for (var i = 0; i<fieldName.length; i++) {
			var c = fieldName[i],
			    doLookup = true;
			switch(c) {
				case '.':
					if(segType!='a property')
						throw new Error('"'+fieldName+'" is not a valid field name.  Found the end of a property while looking for the end of '+segType+' at position '+i+'.');
					fieldSegs.push(seg);
					segType = 'a property';
					break;
				case '[':
					if(segType!='a property')
						throw new Error('"'+fieldName+'" is not a valid field name.  Found the start of an index while looking for the end of '+segType+' at position '+i+'.');
					fieldSegs.push(seg);
					segType = 'an index';
					break;
				case ']':
					if(segType!='an index')
						throw new Error('"'+fieldName+'" is not a valid field name.  Found the end of an index while looking for the end of '+segType+' at position '+i+'.');
					fieldSegs.push(seg);
					segType = 'a property';
					break;
				default:
					if(segType=='an index' && c.match(/^(\s|[0-9])$/)==null)
						throw new Error('"'+fieldName+'" is not a valid field name.  Found a non-integer and non-whitespace character in '+segType+' at position '+i+'.');
					seg += c;
					doLookup = false;
					break;
			}
			if(doLookup){
				obj = obj[seg];
				seg = '';
			}
		}
		return obj[seg];
	};

	Row.prototype.lookupValues = function(columns) {
		var row = this;
		return columns.map(function(column){
			if(typeof column!=='string')
				column = column.field;
			return row.lookupValue(column);
		});
	};

	Row.prototype.getAllValues = function(){
		return this.lookupValues(this.table.getAllColumns());
	};

	return Row;
});