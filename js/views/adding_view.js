define(['./diff_view'], function(DiffView){
	
	function AddingView(diffModel, diffController, $ele){
		DiffView.apply(this, arguments);
	}

	AddingView.prototype = Object.create(DiffView.prototype);
	AddingView.prototype.constructor = AddingView;

	AddingView.prototype.render = function(){

		this._$ele.empty();

		var orig = $('<div class="diff_text">'+this._diffModel.getOrigString()+'</div>');
		var input = $('<textarea class="diff_input" data-hook="diff-input">'+this._diffModel.getOrigString()+'</textarea>');
		var output = $('<div class="diff_text" data-hook="diff-view">'+this._diffModel.getOrigString()+'</div>');

		var buttons = $('<ul class="diff__buttons"></ul>');
		buttons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#" data-hook="looked">Looked up</a></li>');
		buttons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#" data-hook="sure">Sure</a></li>');
		buttons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#" data-hook="unsure">Unsure</a></li>');

		var adminButtons = $('<ul class="diff__buttons"></ul>');
		adminButtons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#" data-hook="save">Save</a></li>');

		var holder = $('<div>');
		holder.append(orig);
		holder.append(input);
		holder.append(buttons);
		holder.append(adminButtons);
		holder.append(output);

		this._$ele.append(holder);

		this._$diffEle = $('[data-hook=diff-view]', this._$ele);
		this._$diffInput = $('[data-hook=diff-input]', this._$ele);

		this._diffController.setInput(this._$diffInput);
		this.addEvents();

		this.renderDiff();
	}

	AddingView.prototype.addEvents = function(){
		DiffView.prototype.addEvents.call(this);

		$('[data-hook=looked]', this._$ele).on('click', this._diffController.addLookedUpHandler.bind(this._diffController));
		$('[data-hook=sure]', this._$ele).on('click', this._diffController.addUnsureHandler.bind(this._diffController));
		$('[data-hook=unsure]', this._$ele).on('click', this._diffController.addSureHandler.bind(this._diffController));
		$('[data-hook=save]', this._$ele).on('click', this._diffController.saveHandler.bind(this._diffController));
	}

	return AddingView;

});