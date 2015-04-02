(function () {
	'use strict';

	angular
		.module('lookup')
		.directive('lookupScrolled', lookupScrolledDirective);

	function lookupScrolledDirective() {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var raw = elem[0];

				elem.bind('scroll', function () {
					if (raw.scrollHeight && raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
						scope.$apply(attrs.lookupScrolled);
					}
				});
			}
		};
	};

})();