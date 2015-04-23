(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('lasyShow', ['$animate', lasyShowDirective]);

	function lasyShowDirective($animate) {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {

				scope.$watch(attr.lasyShow, function (value) {
					if (value) {
						$animate.addClass(element, 'show-transparently')
						.then(function () {
							setTimeout(function () {
								element.addClass('is-shown');
							}, 10);
						});
					} else {
						element.removeClass('is-shown');
						element.removeClass('show-transparently');
					}

				});
			}
		};
	};

})();