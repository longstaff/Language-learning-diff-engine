define(['./diff_view'], function(DiffView){
	
	function NewView(diffController, $ele){
		this._$ele = $ele;
		this._diffController = diffController;
		this.render();
	}

	NewView.prototype.render = function(){

		this._$ele.empty();

		var input = $('<textarea class="diff_input" data-hook="diff-input"></textarea>');

		var adminButtons = $('<ul class="diff__buttons"></ul>');
		adminButtons.append('<li class="diff__buttons__item"><a class="diff__buttons__link" href="#" data-hook="save">Save</a></li>');

		var holder = $('<div>');
		holder.append(input);
		holder.append(adminButtons);

		this._$ele.append(holder);

		this._$diffInput = $('[data-hook=diff-input]', this._$ele);
		this._diffController.setInput(this._$diffInput);
		this.addEvents();
	}

	NewView.prototype.addEvents = function(){
		$('[data-hook=save]', this._$ele).on('click', this._diffController.saveHandler.bind(this._diffController));
	}

	return NewView;

});