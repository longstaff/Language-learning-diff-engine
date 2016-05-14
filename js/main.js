(function(){

	var diffs = [];
	var index = 0;

	var lookedButton = $('[data-hook=looked]');
	var sureButton = $('[data-hook=sure]');
	var unsureButton = $('[data-hook=unsure]');

	var diffOrig = $('[data-hook=diff-orig]');
	var diffInput = $('[data-hook=diff-input]');
	var diffOutput = $('[data-hook=diff]');

	var diffLast = diffOrig.val();
	var lookedUp = [];
	var unsure = [];
	var sure = [];
	var removed = [];

	lookedButton.on('click', handleLookedButton);
	sureButton.on('click', handleSureButton);
	unsureButton.on('click', handleUnsureButton);

	$(document).on('keyup', handleKeyUp);
	outputDiff();

	function handleKeyUp(ev){
		switch(ev.which) {
	        case 37: // left
	        	index = Math.max(0, index-1);
	        	outputDiff(index);
	        break;

	        case 39: // right
	        	index = Math.min(diffs.length+1, index+1);
	        	outputDiff(index);
	        break;

	        default: return;
	    }
	    ev.preventDefault();
	}

	function handleLookedButton(ev){
		ev.preventDefault();
		var diff = JsDiff.diffWords(diffLast, diffInput.val());
		diff.submitType="looked";
		testText(diff);
	}

	function handleSureButton(ev){
		ev.preventDefault();
		var diff = JsDiff.diffWords(diffLast, diffInput.val());
		diff.submitType="sure";
		testText(diff);
	}

	function handleUnsureButton(ev){
		ev.preventDefault();
		var diff = JsDiff.diffWords(diffLast, diffInput.val());
		diff.submitType="unsure";
		testText(diff);
	}
	function testText(diff){
		diffs.push(diff);
		index = diffs.length;
		diffLast = diffInput.val();
		outputDiff(diffs.length);
	}

	function getCombinedArrays(string){
		var output = [];

		var min = 0;
		var nextObj;
		var testObj;

		do{
			nextObj = null;
			var start = 9999999;

			testObj = getNextAfter(lookedUp, min, start);
			if(testObj){
				nextObj = testObj;
				nextObj.type = "lookedup";
				start = nextObj.start;
			}
			testObj = getNextAfter(unsure, min, start);
			if(testObj){
				nextObj = testObj;
				nextObj.type = "unsure";
				start = nextObj.start;
			}
			testObj = getNextAfter(sure, min, start);
			if(testObj){
				nextObj = testObj;
				nextObj.type = "sure";
				start = nextObj.start;
			}
			testObj = getNextAfter(removed, min, start);
			if(testObj){
				nextObj = testObj;
				nextObj.type = "removed";
				start = nextObj.start;
			}

			if(nextObj){
				output.push(nextObj);
				min = nextObj.end;
			}
		}
		while(string.length > min && nextObj)

		return output;
	}

	function getNextAfter(arr, min, start){
		var nextObj;

		for(var ii = 0; ii<arr.length; ii++){
			if(arr[ii].start >= min && arr[ii].start <= start){
				start = arr[ii].start;
				nextObj = arr[ii];
			}
		}
		return nextObj;
	}

	function addOffset(arr, start, length){

		//if(arr !== lookedUp){
			addPadding(lookedUp, start, length);
		//}
		//if(arr !== unsure){
			addPadding(unsure, start, length);
		//}
		//if(arr !== sure){
			addPadding(sure, start, length);
		//}
		//if(arr !== removed){
			addPadding(removed, start, length);
		//}
		arr.push({start:start, end:start+length});

		return start+length;
	}

	function removeArea(start, length){
		var negLength = -length;
		addPadding(lookedUp, start, negLength);
		addPadding(unsure, start, negLength);
		addPadding(sure, start, negLength);
		addPadding(removed, start, negLength);
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
					added.push({start:start+pad, end:arr[ii].end+pad});
					arr[ii].end = start;
				}
			}
			//Add the extras after to avoid looping issues.
			arr = arr.concat(added);
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

					//If its less then remove this completely
					if(arr[ii].end <= arr[ii].start){
						remove.push(ii);
					}
				}
				else if (arr[ii].end >= start && arr[ii].end >= start + pad){
					//If its contained in the element, just remove the padding length
					arr[ii].end = arr[ii].end - pad;
				}
				else if (arr[ii].end >= start){
					//If its over element, just set to the start of the deletion
					arr[ii].end = start;
				}
			}
			for(var ii=0; ii<remove.length; ii++){
				arr.splice(remove[ii], 1);
			}
		}

	}

	function outputDiff(step){

		var currentString = diffOrig.val();
		lookedUp = [];
		unsure = [];
		sure = [];
		removed = [];

		var final = false;
		var renderStep

		if(step != null && step <= diffs.length){
			renderStep = Math.min(step, diffs.length);
		}
		else{
			final = true;
			renderStep = diffs.length;
		}

		for(var ii=0; ii<renderStep; ii++){
			var diff = diffs[ii];
			var offset = 0;
			var last = ii === renderStep -1;

			diff.forEach(function(part){

				if(part.removed){

					//Remove the string
					currentString = currentString.slice(0, offset) + currentString.slice(offset + part.value.length);
					removeArea(offset, part.value.length);

					if(last && !final){
						//If its the last entry, show the deleted string again with brackets
						currentString = currentString.slice(0, offset) + "[" + part.value + "]" + currentString.slice(offset);
						offset = addOffset(removed, offset, part.value.length + 2);
					}

				}
				else if(part.added){
					currentString = currentString.slice(0, offset) + (part.value) + currentString.slice(offset);

					var arr = sure;
					if(diff.submitType==="looked"){
						arr = lookedUp;
					}
					if(diff.submitType==="sure"){
						arr = sure;
					}
					if(diff.submitType==="unsure"){
						arr = unsure;
					}

					offset = addOffset(arr, offset, part.value.length);
				}
				else{
					//This is just skipped, nothing changed.
					offset = offset + part.value.length;
				}
			});
		}

		diffOutput.empty();
		output = getCombinedArrays(currentString);

		var index = 0;

		for(var ii=0; ii<output.length; ii++){
			if(output[ii].start > index){
				var span = $('<span class="diff_span">'+currentString.slice(index, output[ii].start)+'</span>');		  
				diffOutput.append(span);
			}

			var span = $('<span class="diff_span diff_span--'+output[ii].type+'">'+currentString.slice(output[ii].start, output[ii].end)+'</span>');		  
			diffOutput.append(span);

			index = output[ii].end;
		}

		if(index < currentString.length){
			var span = $('<span class="diff_span">'+currentString.substring(index)+'</span>');		  
			diffOutput.append(span);
		}
	}

})();