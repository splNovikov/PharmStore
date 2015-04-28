/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('scrollHeader', function () {
			return {
				restrict: 'A',
				link: function (scope, elem, attr) {
					var lastScrollLeft = 0,
						headerElemnet = angular.element(elem.parent()[0].querySelector('.' + attr.scrollHeader));
					elem.bind('scroll', function () {
						var elemScrollLeft = elem.scrollLeft();
						if (lastScrollLeft != elemScrollLeft) {
							headerElemnet.css({ 'left': -elemScrollLeft });
							lastScrollLeft = elemScrollLeft;
						}
					})
				}
			};
		})

})();