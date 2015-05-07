/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('dropZoneLeave', function () {
			return {
				restrict: 'A',
				link: function (scope, elem, attr) {
					var parentElement = elem.parent();

					scope.$watch(attr.hideImmediately, function (newVal) {
						if (newVal) {
							parentElement.removeClass('drop-zone-is-shown');
						}
					});

					elem.bind('dragleave', function (e) {
						parentElement.removeClass('drop-zone-is-shown');
					});

				}
			};
		})

})();