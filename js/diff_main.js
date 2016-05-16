require(['jquery', './constants/constants', './model/data_loader', './model/diff_model', './controllers/adding_controller', './views/adding_view', './controllers/timeline_controller', './views/timeline_view', './controllers/new_controller', './views/new_view'], function($, Constants, DataLoader, DiffModel, AddingController, AddingView, TimelineController, TimelineView, NewController, NewView) {
	
	var token = $('[data-hook=csrf_token]');
	var adminToken = $('[data-hook=admin_token]');
	var isAdmin = adminToken.length > 0;

	var dataLoader = new DataLoader(token.val(), isAdmin ? adminToken.val() : '');
	token.remove();
	adminToken.remove();

	$page = $('[data-hook=page]');

	$.when(dataLoader.getOpenDataIds()).done(function(data){

		for(var ii=0; ii<data.length; ii++){

			(function scopeCapture(){
			
				var dataId = data[ii];
				var $ele = $('<div class="diff" data-hook="diff-view" data-id="'+dataId+'"></div>')
				$page.append($ele);

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
		$ele.remove();
	}

});