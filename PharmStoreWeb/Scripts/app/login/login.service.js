(function () {
	'use strict';

	angular
		.module('login')
		.factory('loginService', ['$http', '$q', 'loginApiPath', 'localStorageService', loginService]);

	function loginService($http, $q, loginApiPath, localStorageService) {

		var _authenticate,
			_logOut,
			_getUserData,
			_getUserBranches;

		_authenticate = function (email, password) {
			var deferred = $q.defer();

			$http.post(loginApiPath + '/Authenticate/', { Email: email, Password: password })
			.success(function (response) {
				if (response === 403) {
					_logOut();
					deferred.reject();
				} else {
					localStorageService.set('authorizationData', { token: response.Token, user: response.User });
					localStorageService.set('userBranches', response.Branches);
					deferred.resolve(response);
				}
			})
			.error(function (err, status) {
				_logOut();
				deferred.reject(err);
			});

			return deferred.promise;
		};

		_logOut = function () {
			localStorageService.remove('authorizationData');
		};

		_getUserData = function () {
			return localStorageService.get('authorizationData');
		};

		_getUserBranches = function () {
			return localStorageService.get('userBranches');
		};

		return {
			authenticate: _authenticate,
			logOut: _logOut,
			getUserData: _getUserData,
			getUserBranches: _getUserBranches
		};

	}

})();