(function () {
	'use strict';

	angular
		.module('pharmStore')
		.controller('LayoutCtrl', ['$scope', 'APP_MAIN_CONSTANTS', LayoutCtrl])

	function LayoutCtrl($scope, APP_MAIN_CONSTANTS) {

		$scope.appTitle = APP_MAIN_CONSTANTS.appTitle;

	}

})();