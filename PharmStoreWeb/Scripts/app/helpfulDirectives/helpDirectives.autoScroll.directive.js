/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('autoScroll', function () {
			return {
				restrict: 'A',
				scope: {
					linesToScroll: "="
				},
				link: function (scope, elem, attr) {
					scope.$watch('linesToScroll', function (val) {
						if (val !== undefined) {
							elem.scrollTop(val * 24);
						}
					})
					
				}
			};
		})

})();