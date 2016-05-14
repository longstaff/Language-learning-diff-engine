require(['jquery', './model/diff_model', './controllers/adding_controllers', './views/diff_view'], function($, DiffModel, AddingController, DiffView) {
	
	var diffModel = new DiffModel({
		string:'This is a string to be tested'
	});
	var addingController = new AddingController(
		diffModel
	);
	var diffView = new DiffView(
		diffModel,
		addingController,
		$('[data-hook=diff-view]')
	);

});