/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('helpDirectives')
		.directive('offClick', ['$document', '$timeout', function ($document, $timeout) {

			function targetInFilter(target, filter) {
				if (!target || !filter) return false;
				var elms = angular.element(document.querySelectorAll(filter));
				var elmsLen = elms.length;
				for (var i = 0; i < elmsLen; ++i)
					if (elms[i].contains(target)) return true;
				return false;
			};


			function targetCustomClassFilter(target, filter) {
				if (!target || !filter || (target && target.parentElement && !target.parentElement.hasAttribute('is-off-click-exception'))) return false;
				
				var filterLen = filter.length;
				for (var i = 0; i < filterLen; ++i)
					if (target.classList.contains(filter[i])) return true;
				return false;
			};


			return {
				restrict: 'A',
				scope: {
					offClick: '&',
					offClickIf: '&',
					offClickCustomClass: '='
				},
				link: function (scope, elm, attr) {


					if (attr.offClickIf) {
						scope.$watch(scope.offClickIf, function (newVal, oldVal) {
							if (newVal && !oldVal) {
								$timeout(function () {
									$document.on('click', handler);
								});
							} else if (!newVal) {
								$document.off('click', handler);
							}
						}
						);
					} else {
						$document.on('click', handler);
					}


					scope.$on('$destroy', function () {
						$document.off('click', handler);
					});


					function handler(event) {
						// This filters out artificial click events. Example: If you hit enter on a form to submit it, an
						// artificial click event gets triggered on the form's submit button.
						if (event.pageX == 0 && event.pageY == 0) return;

						var target = event.target || event.srcElement;
						if (!(elm[0].contains(target) || targetInFilter(target, attr.offClickFilter) || targetCustomClassFilter(target, scope.offClickCustomClass))) {
							scope.$apply(scope.offClick());
						}
					}
				}
			};
		}]);

})();