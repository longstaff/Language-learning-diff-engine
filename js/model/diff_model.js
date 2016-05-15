define(['../constants/constants', './base_model'], function(Constants, BaseModel){
	
	function DiffModel(obj){
		BaseModel.call(this);

		this._origString;
		this._diffs;
		this._id;

		this._calculatedString;
		this._calculatedDecorators;

		this.init(obj);
	}

	DiffModel.prototype = Object.create(BaseModel.prototype);
	DiffModel.prototype.constructor = DiffModel;

	DiffModel.prototype.init = function init(obj){
		obj = obj || {};

		this._origString = obj.string || '';
		this._diffs = obj.diffs || [{
			diff:[{
				value:this._origString
			}],
			type:init
		}];
		this._id = obj.id;

		this._index = this._diffs.length + 1;
	}

	DiffModel.prototype.getId = function getId(){
		return this._id;
	}

	DiffModel.prototype.getState = function getState(){
		var obj = {};

		obj.string = this._origString;
		obj.diffs = this._diffs;
		obj.id = this._id;

		return obj;
	}

	DiffModel.prototype.getOrigString = function getOrigString(){
		return this._origString;
	}
	DiffModel.prototype.getDiffs = function getDiffs(){
		return this._diffs;
	}

	DiffModel.prototype.setIndex = function setIndex(ind){
		this._index = ind;
		this.clearCalc();
		this.emitEvent();
	}
	DiffModel.prototype.getIndex = function getIndex(){
		return this._index;
	}
	DiffModel.prototype.nextIndex = function nextIndex(){
		this.setIndex(Math.min(this._index + 1, this._diffs.length + 1));
		return this._index;
	}
	DiffModel.prototype.prevIndex = function prevIndex(){
		this.setIndex(this._index = Math.max(this._index - 1, 1));
		return this._index;
	}

	DiffModel.prototype.addDiff = function addDiff(diff, type){
		this._diffs.push({
			diff:diff,
			type:type
		});
		this._index = this._diffs.length;
		this.clearCalc();
		this.emitEvent();
	}

	DiffModel.prototype.getDiffString = function getDiffString(){
		if(!this._calculatedString){
			this.calcDiff();
		}
		return this._calculatedString;
	}

	DiffModel.prototype.getDiffDecorators = function getDiffDecorators(){
		if(!this._calculatedDecorators){
			this.calcDiff();
		}
		return this._calculatedDecorators;
	}

	DiffModel.prototype.clearCalc = function clearCalc(){
		this._calculatedDecorators = null;
		this._calculatedString = null;
	}

	DiffModel.prototype.calcDiff = function calcDiff(){

		var currentString = this._origString;
		var decorators = [];

		var final = false;
		var renderStep;

		if(this._index != null && this._index <= this._diffs.length){
			renderStep = Math.min(this._index, this._diffs.length);
		}
		else{
			final = true;
			renderStep = this._diffs.length;
		}

		for(var ii=0; ii<renderStep; ii++){
			var diff = this._diffs[ii].diff;
			var type = this._diffs[ii].type;
			var offset = 0;
			var last = ii === renderStep -1;

			diff.forEach(function(part){

				if(part.removed){

					//Remove the string
					currentString = currentString.slice(0, offset) + currentString.slice(offset + part.value.length);
					removeArea(decorators, offset, part.value.length);

					if(last && !final){
						//If its the last entry, show the deleted string again with brackets
						currentString = currentString.slice(0, offset) + "[" + part.value + "]" + currentString.slice(offset);
						offset = addDecoratorTo(decorators, Constants.DIFF_TYPE_REMOVE, offset, part.value.length + 2);
					}

				}
				else if(part.added){
					currentString = currentString.slice(0, offset) + (part.value) + currentString.slice(offset);
					offset = addDecoratorTo(decorators, type, offset, part.value.length);
				}
				else{
					//This is just skipped, nothing changed.
					offset = offset + part.value.length;
				}
			});
		}

		this._calculatedString = currentString;
		this._calculatedDecorators = decorators.sort(function(a, b){return a.start - b.start});
	}

	function addDecoratorTo(decorators, type, start, length){
		addPadding(decorators, start, length);
		decorators.push({start:start, end:start+length, type:type});
		return start+length;
	}

	function removeArea(decorators, start, length){
		var negLength = -length;
		addPadding(decorators, start, negLength);
	}

	function addPadding(arr, start, pad){
		if(pad === 0) return;
		if(pad > 0){
			//Adding padding
			var added = [];
			for(var ii=0; ii<arr.length; ii++){
				
				if (arr[ii].start >= start) {
					arr[ii].start = arr[ii].start + pad;
					arr[ii].end = arr[ii].end + pad;
				}
				else if (arr[ii].end > start) {
					//Split this by making a new section
					added.push({start:start+pad, end:arr[ii].end+pad, type:arr[ii].type});
					arr[ii].end = start;
				}
			}
			//Add the extras after to avoid looping issues.
			for(var ii=0; ii<added.length; ii++){
				arr.splice(arr.length, 0, added[ii]);
			}
		}
		else {
			//Removing padding
			pad = -pad;
			var remove = [];
			for(var ii=0; ii<arr.length; ii++){
				if (arr[ii].start > start + pad){
					//Just move the whole thing
					arr[ii].start = arr[ii].start - pad;
					arr[ii].end = arr[ii].end - pad;
				}
				else if (arr[ii].start >= start){
					//Move the start date and reduce length
					var length = (start + pad) - arr[ii].start;
					arr[ii].start = start;
					arr[ii].end = arr[ii].end - pad - length;
				}
				else if (arr[ii].end >= start && arr[ii].end >= start + pad){
					//If its contained in the element, just remove the padding length
					arr[ii].end = arr[ii].end - pad;
				}
				else if (arr[ii].end >= start){
					//If its over element, just set to the start of the deletion
					arr[ii].end = start;
				}

				//If its less then remove this completely
				if(arr[ii].end <= arr[ii].start){
					remove.push(ii);
				}
			}
			for(var ii=0; ii<remove.length; ii++){
				arr.splice(remove[ii], 1);
			}
		}
	}

	return DiffModel;

});