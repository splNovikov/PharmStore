(function () {
	'use strict';

	angular
		.module('modals')
		.controller('ModalsAlertController', [
			'$scope',
			'$modalInstance',
			'$sce',
			'modalsService',
			'alertViewType',
			'entity',
			'title',
			'yesCallback',
			ModalsAlertController]);


	function ModalsAlertController(
		$scope,
		$modalInstance,
		$sce,
		modalsService,
		alertViewType,
		entity,
		title,
		yesCallback) {

		$scope.title = title;

		modalsService.getTemplate(alertViewType).then(function (tmpl) {
			$scope.template = $sce.trustAsHtml(_.template(tmpl, { entity: entity }));
		});

		$scope.ok = function () {
			$modalInstance.close();

			if (yesCallback && typeof (yesCallback) === 'function') {
				yesCallback();
			}
		};
	}
})();