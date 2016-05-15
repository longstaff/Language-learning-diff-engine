define(['../constants/constants'], function(Constants){
	
	function TimelineController(diffModel){
		this._diffModel = diffModel;
	}

	TimelineController.prototype.clickedTimeline = function(ev){
		ev.preventDefault();
		var point = $(ev.target);
		var index = +point.data('index');

		this._diffModel.setIndex(index);
	}

	TimelineController.prototype.clickedNext = function(ev){
	    ev.preventDefault();
    	this._diffModel.nextIndex();
    }
	TimelineController.prototype.clickedPrev = function(ev){
	    ev.preventDefault();
    	this._diffModel.prevIndex();
    }

	TimelineController.prototype.addKeyboardNavHandler = function(ev){
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

	return TimelineController;

});