define([
	'../utils'
],function(Utils){

	function Pagination(core, options) {
		console.log('Pagination::__init__', options);
		this.core = core;
		this.options = options.get('pagination');

		this.curPage = 0; // 0-based!
		this.pageSize = 0;
		this._offset=0;
		this.fromRow=0;
		this.endRow=0;

		this.lastRow=Number.POSITIVE_INFINITY;
		this.lastPage=Number.POSITIVE_INFINITY;

		switch(this.options.method){
			case 'byPage':
				this.byPage(this.options.curPage, this.options.pageSize);
				break;
			case 'byRange':
				this.byRange(this.options.startRow, this.options.endRow, true);
				break;
			default:
				throw new Error('"'+this.options.method+'" is not a valid pagination method.');
		}

		Pagination.__super__.constructor.call(this);
	}

	Utils.Extend(Pagination, Utils.Observable);

	Pagination.prototype.bind = function(core) {
		var self = this;

		console.log('Pagination::bind', self, arguments);
		core.on('pagination:update', function(params){
			console.log('Pagination::bind(pagination:update)', self, arguments);
			if(params.curPage){
				var curPage = params.curPage;
				if(typeof params.curPage == 'string') {
					switch(curPage.toLowerCase()){
						case 'prev':
							curPage = Math.max(curPage, self.firstPage);
							break;
						case 'next':
							curPage = Math.min(curPage, self.lastPage);
							break;
						case 'first':
							curPage = self.firstPage;
							break;
						case 'last':
							curPage = self.lastPage;
							break;
						default:
							throw new Error('"'+curPage+'" is not a valid page name.');
							break;
					}
				}

				if(curPage != self.curPage && self.firstPage <= curPage && curPage <= self.lastPage) {
					self.setCurPage(params.curPage);
				}
			}
		});
	}

	Pagination.prototype.byPage = function (curPage, pageSize, offset) {
		this.curPage = curPage;
		
		if(arguments.length>1)
			this.pageSize = pageSize;

		if(arguments.length>2)
			this._offset = offset;
		else
			this._offset = 0;

		this.fromRow = this._offset + (this.curPage) * this.pageSize;
		this.endRow = this._offset + (this.curPage+1) * this.pageSize-1;
		this.trigger('pagination:updated', {
			pagination: this
		});
	}

	Pagination.prototype.byRange = function (startRow, endRow, forceIt) {
		forceIt = arguments.length>2 ? forceIt : false;
		if (startRow < 0 ) {
			throw new Error("Having startRow="+startRow+" and endRow="+ endRow+" makes absolutely no sense.  Check your maths!");
		}
		if (startRow > endRow) {
			throw new Error("Having startRow="+startRow+" and endRow="+ endRow+" makes absolutely no sense.  Check your maths!");
		}
		var pageSize = endRow - startRow + 1;
		var curPage = Math.floor(startRow/pageSize);
		var offset = startRow % pageSize;
		offset += (offset<0) ? pageSize : 0;

		if (forceIt || ( this._offset == offset )) {
			this._offset = offset;
			this.startRow = startRow;
			this.endRow = endRow;
			this.pageSize = pageSize;
			this.curPage = curPage;
		} else {
			throw new Error("startRow="+startRow+" and endRow="+ endRow+" don't land on page boundaries.");
		}
		this.trigger('pagination:updated', {
			pagination: this
		});
	}

	Pagination.prototype.setCurPage = function(curPage){ // n is 
		this.byPage(curPage);
	}

	Pagination.prototype.prevPage = function(){
		this.byPage(this.curPage-1);
	}

	Pagination.prototype.nextPage = function(){
		this.byPage(this.curPage+1);
	}

	Pagination.prototype.setMaxNumRows = function(maxRows){
		this.lastRow = maxRows;
		this.lastPage = Math.ceil((maxRows - this._offset)/this.pageSize);

		this.trigger('pagination:changed', {
			pagination: this
		});
	}

	Pagination.prototype.setMaxPage = function(maxPage){
		this.lastPage = maxPage;
		this.lastRow = this._offset+(maxPage*this.pageSize);
		this.trigger('pagination:updated', {
			pagination: this
		});
	}

	Pagination.prototype.applyTo = function(rows){
		var self = this;
		var page = rows.filter(function(row, index, arr){
			return self.fromRow <= index && index <= self.endRow;
		});
		console.log('Pagination::applyTo', this, rows, page);
		return page;
	}

	Object.defineProperty(Pagination.prototype, 'firstPage', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this._offset==0?0:-1;
		}
	});

	return Pagination;
});