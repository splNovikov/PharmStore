(function () {
	'use strict';

	angular
		.module('modals')
		.controller('ModalsConfirmController', [
			'$scope',
			'$modalInstance',
			'$sce',
			'modalsService',
			'title',
			'confirmViewType',
			'entity',
			'yesCallback',
			'cancelCallback',
			ModalsConfirmController]);


	function ModalsConfirmController(
		$scope,
		$modalInstance,
		$sce,
		modalsService,
		title,
		confirmViewType,
		entity,
		yesCallback,
		cancelCallback) {

		$scope.title = title;

		modalsService.getTemplate(confirmViewType).then(function (tmpl) {
			$scope.template = $sce.trustAsHtml(_.template(tmpl, { entity: entity }));
		});

		$scope.ok = function () {
			$modalInstance.close();

			if (yesCallback && typeof (yesCallback) === 'function') {
				yesCallback();
			}
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');

			if (cancelCallback && typeof (cancelCallback) === 'function') {
				cancelCallback();
			}
		};
	}
})();