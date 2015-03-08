/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('main')
		.directive('mainHeader', mainHeaderDirective);

	function mainHeaderDirective() {
		return {
			templateUrl: 'main/headerView',
			replace: true,
			restrict: 'E',
			scope: false
		};
	}

})();