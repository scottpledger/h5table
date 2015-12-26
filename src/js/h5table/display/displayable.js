define([
  'jquery',
  '../utils'
], function ($, Utils) {
	function Displayable(parent, $parentContainer) {
		this.parent = parent;
		this.$parentContainer = $parentContainer;
		this._children = [];
		Displayable.__super__.constructor.call(this);
	}

	Utils.Extend(Displayable, Utils.Observable);

	Displayable.prototype.init = function(){

	}

	Displayable.prototype.newChild = function(ChildClass, $container, initArgs, appendTo){
		var inst = new ChildClass(this.parent, $container || this.$parentContainer);
		initArgs = arguments.length>2 ? initArgs : [];
		inst.init.apply(inst, initArgs);
		this._children.push(inst);
		if(appendTo){
			if(!this[appendTo]){
				this[appendTo] = [];
			}
			this[appendTo].push(inst);
		}
		return inst;
	}

	Displayable.prototype.bind = function(core, $container){
		for(var i = 0; i<this._children.length;i++){
			this._children[i].bind(core, $container);
		}
	}

	Displayable.prototype.display = function(){

	}

	Displayable.prototype.destroy = function(){

	}

	Displayable.prototype.getCore = function(){
		// "Core" should always be the top parent.
		var core = this;
		while(core.parent){
			core = core.parent;
		}
		return core;
	}

	return Displayable;
});