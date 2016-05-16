define(['./diff_view'], function(DiffView){
	
	function AddingView(diffModel, diffController, $ele){
		DiffView.apply(this, arguments);
		this._diffModel.addListener(this.render.bind(this));
	}

	AddingView.prototype = Object.create(DiffView.prototype);
	AddingView.prototype.constructor = AddingView;

	AddingView.prototype.render = function(){

		this._$ele.empty();

		var active = this._diffModel.getActiveEditing();

		var orig = $('<div class="diff_text">'+this._diffModel.getOrigString()+'</div>');
		var input = $('<textarea class="diff_input" data-hook="diff-input"'+ (active ? '' : ' disabled="disabled"') + '>'+this._diffModel.getCurrentString()+'</textarea>');
		var output = $('<div class="diff_text" data-hook="diff-view">'+this._diffModel.getOrigString()+'</div>');

		var buttons = $('<ul class="diff__buttons"></ul>');
		buttons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#"'+ (active ? '' : ' disabled="disabled"') + ' data-hook="looked">Looked up</a></li>');
		buttons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#"'+ (active ? '' : ' disabled="disabled"') + ' data-hook="sure">Sure</a></li>');
		buttons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#"'+ (active ? '' : ' disabled="disabled"') + ' data-hook="unsure">Unsure</a></li>');

		var adminButtons = $('<ul class="diff__buttons"></ul>');
		adminButtons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#"'+ (active ? '' : ' disabled="disabled"') + ' data-hook="save">Save</a></li>');
		adminButtons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#"'+ (active ? '' : ' disabled="disabled"') + ' data-hook="pause">Pause</a></li>');

		var holder = $('<div>');
		holder.append(orig);
		holder.append(input);
		holder.append(buttons);
		holder.append(adminButtons);
		holder.append(output);

		this._$ele.append(holder);
		if(!active){
			this._$ele.append('<a class="diff__start" href="#" data-hook="start">Start Editing</a>');
		}

		this._$diffEle = $('[data-hook=diff-view]', this._$ele);
		this._$diffInput = $('[data-hook=diff-input]', this._$ele);

		this._diffController.setInput(this._$diffInput);
		this.addEvents();

		this.renderDiff();
	}

	AddingView.prototype.addEvents = function(){
		DiffView.prototype.addEvents.call(this);

		var active = this._diffModel.getActiveEditing();

		if(active){
			$('[data-hook=looked]', this._$ele).on('click', this._diffController.addLookedUpHandler.bind(this._diffController));
			$('[data-hook=sure]', this._$ele).on('click', this._diffController.addUnsureHandler.bind(this._diffController));
			$('[data-hook=unsure]', this._$ele).on('click', this._diffController.addSureHandler.bind(this._diffController));
			$('[data-hook=save]', this._$ele).on('click', this._diffController.saveHandler.bind(this._diffController));
			$('[data-hook=pause]', this._$ele).on('click', this._diffController.stopTimer.bind(this._diffController));
		}
		else{
			$('[data-hook=looked]', this._$ele).on('click', this._diffController.noopHandler.bind(this._diffController));
			$('[data-hook=sure]', this._$ele).on('click', this._diffController.noopHandler.bind(this._diffController));
			$('[data-hook=unsure]', this._$ele).on('click', this._diffController.noopHandler.bind(this._diffController));
			$('[data-hook=save]', this._$ele).on('click', this._diffController.noopHandler.bind(this._diffController));
			$('[data-hook=pause]', this._$ele).on('click', this._diffController.noopHandler.bind(this._diffController));

			$('[data-hook=start]', this._$ele).on('click', this._diffController.startTimer.bind(this._diffController));
		}
	}

	return AddingView;

});