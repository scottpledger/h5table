define([
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function SuffixBase(options, $parentContainer) {
		SuffixBase.__super__.constructor.call(this, options, $parentContainer);

		this.numPages = 5;

		this.$left = $('<div class="left"></div>');
		this.$mid = $('<div class="mid"><nav><ul></ul></nav></div>');
		this.$pageList = this.$mid.find('ul');
		this.$right = $('<div class="right"></div>');

		this.$parentContainer.append(this.$left, this.$mid, this.$right);
	}

	Utils.Extend(SuffixBase, Displayable);

	SuffixBase.prototype.bind = function(core, $container) {
		SuffixBase.__super__.bind.call(this, core, $container);
		var self = this;

		core.on('query:updated', function(params){
			self.display(params.query.pagination);
		});

		core.on('pagination:updated', function(params){
			self.display(params.pagination);
		});

		this.$pageList.on('click','li>a[data-set-page-to]', function(evt){
			var $el = $(this),
			    setTo = $el.data('set-page-to');

			core.trigger('pagination:update', {
				curPage: setTo
			});
		});
	}

	SuffixBase.prototype.display = function(pagination){
		
		console.log('SuffixBase::display', arguments);
		var pagesBefore = Math.floor(this.numPages/2);
			absMinPage = pagination.firstPage,
		    absMaxPage = pagination.lastPage,
		    disMinPage = Math.max(absMinPage, pagination.curPage-pagesBefore),
		    disMaxPage = Math.min(absMaxPage+1, disMinPage+this.numPages);
		if(disMinPage>disMaxPage)
			throw new Error('The minimum page to display is greater than the maximum page to display!');

		this.$pageList.html('<li class="prev"><a href="#" aria-label="Previous" data-set-page-to="first"><span aria-hidden="true">&laquo;</span></a></li><li class="next"><a href="#" aria-label="Next" data-set-page-to="last"><span aria-hidden="true">&raquo;</span></a></li>');
		var $prevBtn = this.$pageList.find('.prev'),
		    $nextBtn = this.$pageList.find('.next');
		if(pagination.curPage==absMinPage)
			$prevBtn.addClass('disabled');
		if(pagination.curPage==absMaxPage)
			$nextBtn.addClass('disabled');
		var i = disMinPage;
		for(var i = disMinPage; i<disMaxPage; i++){
			$nextBtn.before('<li class="'+(i==pagination.curPage?'active':'')+'"><a href="#" data-set-page-to="'+i+'">'+(i+1)+'</a></li>');
		}
	}

	SuffixBase.prototype.destroy = function(){

	}

	return SuffixBase;
});