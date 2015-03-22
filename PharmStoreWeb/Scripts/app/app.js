/// <reference path="../libs/angular/angular.js" />

(function () {
	'use strict';

	angular
		.module('pharmStore', [
			'ui.router',
			'ui.bootstrap',
			'LocalStorageModule',
			'angular-websql',

			// app own modules:
			'helpDirectives',
			'modals',
			'ngSanitize',
			'login',
			'lookup',
			'main',
			'interceptors'
		])

		.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, $stateProvider, $urlRouterProvider) {
			var partialsPath = '/partials/';

			$urlRouterProvider.otherwise('/');

			$stateProvider
				// Main page FOR USER APPLICATION
				.state('index', {
					url: '/',
					templateUrl: partialsPath + 'main/index',
					controller: 'MainController as mainCtrl'
				})

				.state('login', {
					url: '/login',
					templateUrl: partialsPath + 'login/index',
					controller: 'LoginController as loginCtrl'
				})

			$httpProvider.interceptors.push('authInterceptorService');

		}])

		.run([
			'$rootScope',
			'$state',
			'authService',
			'appStart',
			function (
				$rootScope,
				$state,
				authService,
				appStart) {

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

				if (toState.name === 'login') {
					return; 
				}

				if (!authService.isAuthenticated()) {
					event.preventDefault();
					$state.go('login', {}, { reload: true });
				}
			});

			appStart.start();
		}])

})();