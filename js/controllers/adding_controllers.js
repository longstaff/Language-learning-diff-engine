define(['../constants/constants'], function(Constants){
	
	function AddingController(diffModel){
		this._diffModel = diffModel;
	}

	AddingController.prototype.setInput = function(diffInput){
		console.log(diffInput);

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

	AddingController.prototype.resetTarget = function(){
		this._diffTarget = this._$diffInput.val();
	}

	return AddingController;

});