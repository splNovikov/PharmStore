﻿/// <reference path="../libs/angular/angular.js" />

(function () {
	'use strict';

	angular
		.module('pharmStore', [
			'ui.router',
			'ui.bootstrap',
			'LocalStorageModule',

			// app own modules:
			'helpDirectives',
			'modals',
			'ngResource',
			'ngSanitize',
			'login',
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
			'$location',
			'authService',
			'appStart',
			function (
				$rootScope,
				$location,
				authService,
				appStart) {

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				if (toState.name !== 'login' && !authService.isAuthenticated()) {
					$location.path('/login');
				}
			});

			appStart.start();
		}])

})();