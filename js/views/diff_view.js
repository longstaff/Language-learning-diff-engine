define(function(){
	
	function DiffView(diffModel, diffController, $ele){
		this._diffModel = diffModel;
		this._diffController = diffController;
		this._$ele = $ele;
		this._$diffEle;

		this._diffModel.addListener(this.renderDiff.bind(this));
		this.render();
	}

	DiffView.prototype.render = function(){
		this._$ele.empty();

		var orig = $('<div class="diff_text">'+this._diffModel.getOrigString()+'</div>');
		var output = $('<div class="diff_text" data-hook="diff-view">'+this._diffModel.getOrigString()+'</div>');

		var holder = $('<div>');
		holder.append(orig);
		holder.append(output);

		this._$ele.append(holder);

		this._$diffEle = $('[data-hook=diff-view]', this._$ele);
		this.addEvents();

		this.renderDiff();
	}

	DiffView.prototype.renderDiff = function(){

		var outputString = this._diffModel.getDiffString();
		var outputDecorators = this._diffModel.getDiffDecorators();

		this._$diffEle.empty();
		var index = 0;

		for(var ii=0; ii<outputDecorators.length; ii++){
			if(outputDecorators[ii].start > index){
				var span = $('<span class="diff_span">'+outputString.slice(index, outputDecorators[ii].start)+'</span>');		  
				this._$diffEle.append(span);
			}

			var span = $('<span class="diff_span diff_span--'+outputDecorators[ii].type+'">'+outputString.slice(outputDecorators[ii].start, outputDecorators[ii].end)+'</span>');		  
			this._$diffEle.append(span);
			index = outputDecorators[ii].end;
		}

		if(index < outputString.length){
			var span = $('<span class="diff_span">'+outputString.substring(index)+'</span>');		  
			this._$diffEle.append(span);
		}

	}

	DiffView.prototype.addEvents = function(){
		this._$ele.on('keyup', this._diffController.addKeyboardNavHandler.bind(this._diffController));
	}

	return DiffView;

});