/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('ngEnter', function () {
			return {
				restrict: 'A',
				link: function (scope, elem, attr) {
					elem.bind("keydown keypress", function (event) {
						if (event.which === 13) {
							scope.$apply(function () {
								scope.$eval(attr.ngEnter);
							});

							event.preventDefault();
						}
					});
				}
			};
		})

})();