require(['jquery', './constants/constants', './model/data_loader', './model/diff_model', './controllers/adding_controller', './views/adding_view', './controllers/timeline_controller', './views/timeline_view', './controllers/new_controller', './views/new_view'], function($, Constants, DataLoader, DiffModel, AddingController, AddingView, TimelineController, TimelineView, NewController, NewView) {
	
	var token = $('[data-hook=csrf_token]');
	var dataLoader = new DataLoader(token.val());
	token.remove();

	//Set up adding
	$add = $('[data-hook=add-view]');
	var newController = new NewController(
		dataLoader
	);
	var newView = new NewView(
		newController,
		$('[data-hook=add-view]')
	);
	$(newController).on(Constants.EVENT_SAVE, addNew.bind(this, $add));


	$.when(dataLoader.getDataIds()).done(function(data){

		for(var ii=0; ii<data.length; ii++){

			(function scopeCapture(){
			
				var dataId = data[ii];
				var $ele = $('<div class="diff" data-hook="diff-view" data-id="'+dataId+'"></div>')
				$add.after($ele);

				$.when(dataLoader.getData(dataId)).done(function(data){

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

	function addNew($add, ev, dataId){
		var $ele = $('<div class="diff" data-hook="diff-view" data-id="'+dataId+'"></div>')
		$add.after($ele);
		$add.val('');

		$.when(dataLoader.getData(dataId)).done(function(data){
			var diffModel = new DiffModel(data);
			renderEdit($ele, diffModel);
		}.bind(this)).fail(function(){
			console.log("ERROR, no data found for "+dataId)
			$ele.remove();
		}.bind(this));
	}

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

		$(addingController).on(Constants.EVENT_SAVE, renderStatic.bind(this, $ele, diffModel));
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