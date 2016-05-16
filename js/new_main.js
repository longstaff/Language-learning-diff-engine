require(['jquery', './constants/constants', './model/data_loader', './model/diff_model', './controllers/adding_controller', './views/adding_view', './controllers/timeline_controller', './views/timeline_view', './controllers/new_controller', './views/new_view'], function($, Constants, DataLoader, DiffModel, AddingController, AddingView, TimelineController, TimelineView, NewController, NewView) {
	
	var token = $('[data-hook=csrf_token]');
	var adminToken = $('[data-hook=admin_token]');
	var isAdmin = adminToken.length > 0;

	var dataLoader = new DataLoader(token.val(), isAdmin ? adminToken.val() : '');
	token.remove();
	adminToken.remove();

	//Set up adding
	$add = $('[data-hook=add-view]');
	var newController = new NewController(
		dataLoader
	);
	var newView = new NewView(
		newController,
		$('[data-hook=add-view]')
	);
	$(newController).on(Constants.EVENT_SAVE, addNew.bind(this));

	function addNew(ev){
		$('[data-hook=add-view]').val('');
	}

});