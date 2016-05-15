require(['jquery', './constants/constants', './model/data_loader', './model/diff_model', './controllers/adding_controller', './views/adding_view', './controllers/timeline_controller', './views/timeline_view'], function($, Constants, DataLoader, DiffModel, AddingController, AddingView, TimelineController, TimelineView) {
	
	var token = $('[data-hook=csrf_token]');
	var dataLoader = new DataLoader(token.val());
	token.remove();

	$.when(dataLoader.getDataIds()).done(function(data){

		for(var ii=0; ii<data.length; ii++){

			(function scopeCapture(){
			
				var dataId = data[ii];
				var $ele = $('<div class="diff" data-hook="diff-view" data-id="'+dataId+'"></div>')
				$('[data-hook=page]').append($ele);

				$.when(dataLoader.getData(dataId)).done(function(data){

					console.log($ele);

					var editing = data.diffs ? false : true;
					var diffModel = new DiffModel(data);

					if (editing) {
						renderEdit($ele, diffModel);
					}
					else {
						renderStatic($ele, diffModel);
					}

				}.bind(this)).fail(function(){
					console.log("ERROR, no data found for "+dataId)
					$(this).remove();
				}.bind(this));
				
			})();
		}

	}).fail(function(data){
		throw new Error('Server error, PANIC!')
	});

	function renderEdit($ele, diffModel){
		var addingController = new AddingController(
			diffModel,
			dataLoader
		);
		var addingView = new AddingView(
			diffModel,
			addingController,
			$ele
		);

		$(addingController).on(Constants.EVENT_SAVE, renderStatic.bind(this, $ele, diffModel))
	}
	function renderStatic($ele, diffModel){
		var timelineController = new TimelineController(
			diffModel
		);
		var timelineView = new TimelineView(
			diffModel,
			timelineController,
			$ele
		);
	}

});