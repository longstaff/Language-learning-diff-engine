define(['./diff_view'], function(DiffView){
	
	function TimelineView(diffModel, diffController, $ele){
		DiffView.apply(this, arguments);
	}

	TimelineView.prototype = Object.create(DiffView.prototype);
	TimelineView.prototype.constructor = TimelineView;

	TimelineView.prototype.render = function(){

		this._$ele.empty();
		var points = this._diffModel.getDiffs();

		var timeline = $('<ul class="timeline"></ul>');
		points.forEach(function(obj, ind){
			timeline.append('<li class="timeline__item"><a class="timeline__link" href="#" data-hook="timeline" data-index="'+(ind+1)+'">point</a></li>');
		});
		timeline.append('<li class="timeline__item"><a class="timeline__link" href="#" data-hook="timeline" data-index="'+(points.length+1)+'">Final</a></li>');

		var output = $('<div class="diff_text" data-hook="diff-view">'+this._diffModel.getOrigString()+'</div>');

		var holder = $('<div>');
		holder.append(timeline);
		holder.append(output);

		this._$ele.append(holder);
		this._$diffEle = $('[data-hook=diff-view]', this._$ele);

		this.addEvents();

		this.renderDiff();
	}

	TimelineView.prototype.addEvents = function(){
		DiffView.prototype.addEvents.call(this);
		$('[data-hook=timeline]', this._$ele).on('click', this._diffController.clickedTimeline.bind(this._diffController));
	}

	return TimelineView;

});