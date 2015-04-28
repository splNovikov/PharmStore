(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('listScrolled', lookupScrolledDirective);

	function lookupScrolledDirective() {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var raw = elem[0],
					lastScrollLeft = 0;

				elem.bind('scroll', function () {
					var elemScrollLeft = elem.scrollLeft();
					if (lastScrollLeft != elemScrollLeft) { // except of orisontal scroll
						lastScrollLeft = elemScrollLeft;
						return;
					}

					if (raw.scrollHeight && raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
						scope.$apply(attrs.listScrolled);
					}
				});
			}
		};
	};

})();