require(['jquery', './model/diff_model', './controllers/adding_controller', './views/adding_view', './controllers/timeline_controller', './views/timeline_view'], function($, DiffModel, AddingController, AddingView, TimelineController, TimelineView) {
	
	window.data = [];

	$('[data-hook=diff-view]').each(function(){
		var data = $(this).data('string');
		var editing = $(this).data('editing') ? true : false;

		var diffModel = new DiffModel({
			string:data,
			diffArr: [{"type":"added","diff":[{"value":"this is a ","start":0,"end":10}]},{"diff":[{"count":7,"value":"this is a string"},{"count":4,"added":true,"value":" with changes"}],"type":"sure"},{"diff":[{"count":2,"value":"this "},{"count":4,"removed":true,"value":"is a "},{"count":5,"value":"string with changes"}],"type":"unsure"},{"diff":[{"count":2,"value":"this "},{"count":1,"removed":true,"value":"string"},{"count":1,"added":true,"value":"sentance"},{"count":4,"value":" with changes"}],"type":"unsure"},{"diff":[{"count":2,"value":"this "},{"count":2,"added":true,"value":"a "},{"count":5,"value":"sentance with changes"}],"type":"lookup"},{"diff":[{"count":6,"value":"this a sentance "},{"count":1,"removed":true,"value":"with"},{"count":1,"added":true,"value":"that"},{"count":1,"value":" "},{"count":2,"added":true,"value":"had "},{"count":1,"value":"changes"}],"type":"sure"}]
		});

		if (editing) {
			var addingController = new AddingController(
				diffModel
			);
			var addingView = new AddingView(
				diffModel,
				addingController,
				$(this)
			);
		}
		else {
			var timelineController = new TimelineController(
				diffModel
			);
			var timelineView = new TimelineView(
				diffModel,
				timelineController,
				$(this)
			);
		}

		window.data.push(diffModel);
		
	});

});