define(['jquery'], function($){
	
	var saveUrl = 'add.php';
	var dataUrl = 'get.php';

	function DataLoader(token, admin){
		this._token = token;
		this._admin = admin;

		if(this._admin){
			saveUrl = '../' + saveUrl;
			dataUrl = '../' + dataUrl;
		}
	}

	DataLoader.prototype.getDataIds = function(id){
		var promise = $.Deferred();
		$.when($.post(dataUrl, {
			csrf_token: this._token
		})).done(function(data){
			var jsonData = JSON.parse(data);

			if(jsonData.success && jsonData.success === true){
				promise.resolve(jsonData.data);
			}
			else{
				promise.reject();
			}
		}).fail(function(){
			promise.reject();
		})

		return promise;
	}
	DataLoader.prototype.getData = function(id){
		var promise = $.Deferred();
		$.when($.post(dataUrl, {
			csrf_token: this._token,
			id:id
		})).done(function(data){
			var jsonData = JSON.parse(data);

			if(jsonData.success && jsonData.success === true){
				promise.resolve(jsonData.data);
			}
			else{
				promise.reject();
			}
		}).fail(function(){
			promise.reject();
		})

		return promise;
	}
	DataLoader.prototype.getCompleteDataIds = function(id){
		var promise = $.Deferred();
		$.when($.post(dataUrl, {
			csrf_token: this._token,
			complete:true
		})).done(function(data){
			var jsonData = JSON.parse(data);

			if(jsonData.success && jsonData.success === true){
				promise.resolve(jsonData.data);
			}
			else{
				promise.reject();
			}
		}).fail(function(){
			promise.reject();
		})

		return promise;
	}
	DataLoader.prototype.getOpenDataIds = function(id){
		var promise = $.Deferred();
		$.when($.post(dataUrl, {
			csrf_token: this._token,
			open:true
		})).done(function(data){
			var jsonData = JSON.parse(data);

			if(jsonData.success && jsonData.success === true){
				promise.resolve(jsonData.data);
			}
			else{
				promise.reject();
			}
		}).fail(function(){
			promise.reject();
		})

		return promise;
	}

	DataLoader.prototype.newTranslation = function(string){
		var promise = $.Deferred();
		$.when($.post(saveUrl, {
			admin_token: this._admin,
			string:string
		})).done(function(data){
			var jsonData = JSON.parse(data);
			if(jsonData.success && jsonData.success === true){
				promise.resolve(jsonData.id);
			}
			else{
				promise.reject();
			}
		}).fail(function(){
			promise.reject();
		})

		return promise;
	}
	DataLoader.prototype.addDiffs = function(id, diffs){
		var promise = $.Deferred();

		$.when($.post(saveUrl, {
			admin_token: this._admin,
			id:id,
			diffs:diffs
		})).done(function(data){
			var jsonData = JSON.parse(data);
			if(jsonData.success && jsonData.success === true){
				promise.resolve(jsonData.id);
			}
			else{
				promise.reject();
			}
		}).fail(function(){
			promise.reject();
		})

		return promise;
	}


	return DataLoader;

});