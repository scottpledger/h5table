define([
	'./pagination',
	'./filterGroup',
	'../utils'
],function(Pagination, FilterGroup, Utils){

	function Query(core, options){
		this.core = core;
		this.options = options;
		this.pagination = new Pagination(this, options);
		this.search = null;
		this.sortOrders = [];

		Query.__super__.constructor.call(this);
	}

	Utils.Extend(Query, Utils.Observable);

	Query.prototype._registerEvents = function() {
		var self = this;

		this.pagination.on('pagination:updated', function(params){
			console.log('Query::_registerEvents(pagination.updated)', self, arguments);
			
			self.trigger('pagination:updated', params);
		});
	}

	Query.prototype.bind = function(core) {
		var self = this;

		this.pagination.bind(core);

		this._registerEvents();
	}

	Query.prototype.matches = function(row) {
		if(this.search == null)
			return true;
		return this.search.matches(row);
	}

	Query.prototype.filter = function(rows) {
		return rows.filter(this.matches);
	}

	Query.prototype.paginate = function(rows) {
		return this.pagination.applyTo(rows);
	}

	Query.prototype.applyTo = function(rows) {
		return this.paginate(this.sort(this.filter(rows)));
	}

	Query.prototype.sort = function(rows) {
		var self = this;
		if(self.sortOrders.length==0)
			return rows;
		return rows.sort(function(row1, row2) {
			for(var i = 0; i<self.sortOrders.length; i++){
				var c = self.sortOrders[i].compare(row1, row2);
				if(c!=0)
					return c;
			}
			return 0;
		});
	}

	return Query;
});