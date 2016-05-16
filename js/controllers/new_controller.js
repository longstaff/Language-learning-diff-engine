define(['../constants/constants'], function(Constants){
	
	function NewController(dataLoader){
		this._dataLoader = dataLoader;
		this._$diffInput;
	}

	NewController.prototype.setInput = function(diffInput){
		this._$diffInput = diffInput;
	}

	NewController.prototype.saveHandler = function(){
		$.when(this._dataLoader.newTranslation(this._$diffInput.val())).done(function(data){
			console.log("saveHandler");
			$(this).trigger(Constants.EVENT_SAVE);
		}.bind(this)).fail(function(){

		}.bind(this));
	}

	NewController.prototype.resetTarget = function(){
		this._diffTarget = this._$diffInput.val();
	}

	return NewController;

});