/// <reference path="../libs/angular/angular.js" />

(function () {
	'use strict';

	angular
		.module('pharmStore')

		.constant('APP_MAIN_CONSTANTS', {
			appTitle: 'Pharm Store' // don't forget to rename this on Index.cshtml - in title.
		})

		.constant('DebugSettings', {
			couldLog: true,
			isDeveloper: true
		})


})();