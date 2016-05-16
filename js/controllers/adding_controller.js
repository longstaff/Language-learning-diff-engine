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
		this._diffModel.setCurrentString(this._$diffInput.val());
		var diff = JsDiff.diffWords(this._diffTarget, this._$diffInput.val());
		this._diffModel.addDiff(diff, Constants.DIFF_TYPE_LOOKUP);
		this.resetTarget();
	}
	AddingController.prototype.addUnsureHandler = function(ev){
		ev.preventDefault();
		this._diffModel.setCurrentString(this._$diffInput.val());
		var diff = JsDiff.diffWords(this._diffTarget, this._$diffInput.val());
		this._diffModel.addDiff(diff, Constants.DIFF_TYPE_SURE);
		this.resetTarget();
	}
	AddingController.prototype.addSureHandler = function(ev){
		ev.preventDefault();
		this._diffModel.setCurrentString(this._$diffInput.val());
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
		this.stopTimer();
		$.when(this._dataLoader.addDiffs(this._diffModel.getId(), this._diffModel.getDiffs())).done(function(data){
			$(this).trigger(Constants.EVENT_SAVE);
		}.bind(this)).fail(function(){

		}.bind(this));
	}

	AddingController.prototype.resetTarget = function(){
		this._diffTarget = this._$diffInput.val();
	}

	AddingController.prototype.startTimer = function(ev){
		if(ev) ev.preventDefault();
		this._diffModel.setActiveEditing(true);
		this._timerCount = setTimeout(this.addSecond.bind(this), 1000);
	}
	AddingController.prototype.stopTimer = function(ev){
		if(ev) ev.preventDefault();
		clearTimeout(this._timerCount);
		this._diffModel.setActiveEditing(false);
	}

	AddingController.prototype.addSecond = function(){
		this._diffModel.addSecond();
		this._timerCount = setTimeout(this.addSecond.bind(this), 1000);
	}

	AddingController.prototype.noopHandler = function(ev){
		ev.preventDefault();
	}

	return AddingController;

});