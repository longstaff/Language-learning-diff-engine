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

	return TimelineController;

});