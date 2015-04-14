/// <reference path="../../angular.js" />
(function () {
	'use strict';


	angular
		.module('modals')
		.directive('compileTemplates', [
			'$compile',
			'$controller',
			'modalsService',

			function (
				$compile,
				$controller,
				modalsService) {

				return {
					scope: false,
					link: function (scope, element, attrs) {
						var templateCtrl,
						templateScope;


						scope.$watch('nestedView', function (val) {
							if (val) {
								load();
							}
						});


						function load() {

							modalsService.getTemplate(scope.nestedView)
								.then(function (template) {
									templateScope = scope.$new();
									element.html(template);


									if (scope.nestedView.ctrl) {
										templateCtrl = $controller(scope.nestedView.ctrl, { $scope: templateScope });
										element.children().data('$ngControllerController', templateCtrl);
									}


									$compile(element.contents())(templateScope);
								});

						};

					}
				};
			}])


})();