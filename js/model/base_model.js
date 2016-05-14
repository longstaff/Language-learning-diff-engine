define(function(){
	
	function BaseModel(){
		this._listeners = [];
	}

	BaseModel.prototype.addListener = function(func){
		this.removeListener(func);
		this._listeners.push(func);
	}
	BaseModel.prototype.removeListener = function(func){
		if(this._listeners.indexOf(func) >= 0){
			this._listeners.splice(this._listeners.indexOf(func), 1);
		}
	}
	BaseModel.prototype.emitEvent = function(){
		for(var ii=0; ii<this._listeners.length; ii++){
			this._listeners[ii](this);
		}
	}

	return BaseModel;

});