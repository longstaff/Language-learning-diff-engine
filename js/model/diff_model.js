define(['./base_model'], function(BaseModel){
	
	function DiffModel(){
		this._origString = '';
		this._diffs = [];
	}

	DiffModel.prototype = Object.create(BaseModel.prototype);
	DiffModel.prototype.constructor = DiffModel;




	return DiffModel;

});