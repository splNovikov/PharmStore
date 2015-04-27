/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('scrollHeader', ['$document', function ($document) {
			return {
				restrict: 'A',
				link: function (scope, elem, attr) {
					var lastScrollLeft = 0,
						headerElemnet = angular.element(elem.parent()[0].querySelector('.table-header'));
					elem.bind('scroll', function () {
						var elemScrollLeft = elem.scrollLeft();
						if (lastScrollLeft != elemScrollLeft) {
							headerElemnet.css({ 'left': -elemScrollLeft });
							lastScrollLeft = elemScrollLeft;
						}
					})
				}
			};
		}])

})();