(function () {
	'use strict';

	angular
		.module('pharmStore')
		.controller('LayoutCtrl', ['$rootScope', 'APP_MAIN_CONSTANTS', LayoutCtrl])

	function LayoutCtrl($rootScope, APP_MAIN_CONSTANTS) {

		$rootScope.appTitle = APP_MAIN_CONSTANTS.appTitle;

	}

})();