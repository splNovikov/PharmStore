/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('dropZoneEnter', function () {
			return {
				restrict: 'A',
				scope: {
					'hideImmediately': '='
				},
				link: function (scope, elem, attr) {

					elem.bind('dragenter', function (e) {
						scope.hideImmediately = false;
						elem.addClass('drop-zone-is-shown');
					});

				}
			};
		})

})();