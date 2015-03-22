/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('digitsOnly', function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					ngModel: '='
				},
				link: function (scope, elem, attr) {
					var stopWatch;
					elem.bind('focus', function () {
						stopWatch = scope.$watch('ngModel', function (newVal, prevVal, scope) {
							if (newVal === undefined) {
								if (prevVal !== undefined) {
									scope.ngModel = prevVal;
								} else {
									scope.ngModel = null;
								}
							}
						});
					});
					//todo: bind on destroy element
					elem.bind('blur', function () {
						stopWatch();
					})
				}
			};
		})

})();