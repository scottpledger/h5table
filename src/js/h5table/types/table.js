define([
	'./column',
	'./row',
	'../utils'
],function(Column, Row, Utils){
	function Table() {
		this.columns = [];
		this.rows = [];
		
		Table.__super__.constructor.call(this);
	}

	Utils.Extend(Table, Utils.Observable);
	

	Table.prototype.getAllColumns = function(){
		return Array.prototype.concat.apply([], this.columns.map(function(col){
			return col.flatten();
		}));
	};

	Table.prototype.getColumnRows = function(filterFn){
		var rows = [],
		    queue = (filterFn?this.columns.filter(filterFn):this.columns).map(function(col){
		    	return {
		    		depth: 0,
		    		column: col
		    	}
		    });
		while(queue.length>0){
			var item = queue.shift();
			while(item.depth>=rows.length){
				rows.push([]);
			}
			rows[item.depth].push(item.column);
			item.column.children.forEach(function(child){
				queue.push({
					depth: item.depth+1,
					column: child
				});
			});

		}
		return rows;
	}

	return Table;
});