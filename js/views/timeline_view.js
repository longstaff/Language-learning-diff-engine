define(['./diff_view'], function(DiffView){
	
	function TimelineView(diffModel, diffController, $ele){
		DiffView.apply(this, arguments);
		this._diffModel.addListener(this.renderTimeline.bind(this));
	}

	TimelineView.prototype = Object.create(DiffView.prototype);
	TimelineView.prototype.constructor = TimelineView;

	TimelineView.prototype.render = function(){

		this._$ele.empty();
		var points = this._diffModel.getDiffs();

		var timeline = $('<div class="timeline" data-hook="timeline-view">');
		var orig = $('<div class="diff_text">'+this._diffModel.getOrigString()+'</div>');
		var output = $('<div class="diff_text" data-hook="diff-view">'+this._diffModel.getOrigString()+'</div>');

		var holder = $('<div>');
		holder.append(orig);
		holder.append(timeline);
		holder.append(output);

		this._$ele.append(holder);
		this._$diffEle = $('[data-hook=diff-view]', this._$ele);
		this._$timelineEle = $('[data-hook=timeline-view]', this._$ele);

		this.addEvents();

		this.renderDiff();
		this.renderTimeline();
	}

	TimelineView.prototype.renderTimeline = function(){

		this._$timelineEle.empty();
		var points = this._diffModel.getDiffs();

		var timelineList = $('<ul class="timeline__list"></ul>');
		points.forEach(function(obj, ind){
			timelineList.append('<li class="timeline__list__item"><a class="timeline__list__link timeline__list__link--'+obj.type+'" href="#" data-hook="timeline" data-index="'+(ind+1)+'">point</a></li>');
		});
		timelineList.append('<li class="timeline__list__item"><a class="timeline__list__link timeline__list__link--final" href="#" data-hook="timeline" data-index="'+(points.length+1)+'">Final</a></li>');
		timelineList.find('li:eq(' + (this._diffModel.getIndex() - 1) + ') a').addClass('timeline__list__link--active');

		var timelineNav = $('<ul class="timeline__nav"></ul>');
		timelineNav.append('<li class="timeline__nav__item"><a class="timeline__nav__link timeline__nav__link--prev" href="#" data-hook="timeline-prev">Back</a></li>');
		timelineNav.append('<li class="timeline__nav__item"><a class="timeline__nav__link timeline__nav__link--next" href="#" data-hook="timeline-next">Next</a></li>');

		this._$timelineEle.append(timelineNav);
		this._$timelineEle.append(timelineList);

		this.addTimelineEvents();
	}

	TimelineView.prototype.addTimelineEvents = function(){
		$('[data-hook=timeline]', this._$ele).on('click', this._diffController.clickedTimeline.bind(this._diffController));
		$('[data-hook=timeline-prev]', this._$ele).on('click', this._diffController.clickedPrev.bind(this._diffController));
		$('[data-hook=timeline-next]', this._$ele).on('click', this._diffController.clickedNext.bind(this._diffController));
	}

	return TimelineView;

});