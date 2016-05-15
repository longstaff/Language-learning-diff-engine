define(['diff', '../constants/constants'], function(JsDiff, Constants){
	
	function AddingController(diffModel, dataLoader){
		this._diffModel = diffModel;
		this._dataLoader = dataLoader;
	}

	AddingController.prototype.setInput = function(diffInput){
		this._$diffInput = diffInput;
		this._diffTarget = this._$diffInput.val();
	}

	AddingController.prototype.addLookedUpHandler = function(ev){
		ev.preventDefault();
		var diff = JsDiff.diffWords(this._diffTarget, this._$diffInput.val());
		this._diffModel.addDiff(diff, Constants.DIFF_TYPE_LOOKUP);
		this.resetTarget();
	}
	AddingController.prototype.addUnsureHandler = function(ev){
		ev.preventDefault();
		var diff = JsDiff.diffWords(this._diffTarget, this._$diffInput.val());
		this._diffModel.addDiff(diff, Constants.DIFF_TYPE_SURE);
		this.resetTarget();
	}
	AddingController.prototype.addSureHandler = function(ev){
		ev.preventDefault();
		var diff = JsDiff.diffWords(this._diffTarget, this._$diffInput.val());
		this._diffModel.addDiff(diff, Constants.DIFF_TYPE_UNSURE);
		this.resetTarget();
	}

	AddingController.prototype.addKeyboardNavHandler = function(ev){
	    ev.preventDefault();

		switch(ev.which) {
	        case 37: // left
	        	this._diffModel.prevIndex();
	        break;

	        case 39: // right
	        	this._diffModel.nextIndex();
	        break;

	        default: return;
	    }
	}

	AddingController.prototype.saveHandler = function(){
		$.when(this._dataLoader.addDiffs(this._diffModel.getId(), this._diffModel.getDiffs())).done(function(data){
			$(this).trigger(Constants.EVENT_SAVE);
		}.bind(this)).fail(function(){

		}.bind(this));
	}

	AddingController.prototype.resetTarget = function(){
		this._diffTarget = this._$diffInput.val();
	}

	return AddingController;

});