(function () {
	'use strict';

	angular
		.module('login')
		.controller('LoginController', ['$scope', '$state', 'loginService', 'authService', LoginController]);

	function LoginController($scope, $state, loginService, authService) {

		// firstly check if user is already authorised:
		if (authService.isAuthenticated()) {
			$state.go('index');
		}

		//defaults
		$scope.accessInProgress = false;
		$scope.invalidAuth = false;

		$scope.login = function () {
			$scope.accessInProgress = true;

			var error = function () {
				$scope.invalidAuth = true;
				$scope.accessInProgress = false;
			};

			loginService.authenticate(this.loginForm.email, this.loginForm.password)
				.then(function (response) {
					$state.go('index');
				}, error);

		};

	}
})();