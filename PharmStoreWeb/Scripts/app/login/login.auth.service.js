(function () {
	'use strict';

	angular
		.module('login')
		.factory('authService', ['localStorageService', authService]);

	function authService(localStorageService) {

		var _isAuthenticated = function () {

			return localStorageService.get('authorizationData') ? !!localStorageService.get('authorizationData').token : false;
		};

		return {
			isAuthenticated: _isAuthenticated
		};

	}

})();