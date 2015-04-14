(function () {
	'use strict';

	angular
		.module('main')
		.controller('MainController', [
			'$scope',
			'DebugSettings',
			'priceStorageDataService',
			'modalsService',
			MainController]);

	function MainController(
		$scope,
		DebugSettings,
		priceStorageDataService,
		modalsService) {

		$scope.vm = {
			showRefillData: DebugSettings.isDeveloper,
			refillingInProgress: false
		}

		$scope.refillTestData = function () {
			if ($scope.vm.refillingInProgress) {
				return;
			}

			var staticContent = {
				Title: 'Обновляем тестовые данные?',
				AgreeBtnName: 'Давай'
			},
			agreeBtnPostBack = function () {
				$scope.vm.refillingInProgress = true;
				priceStorageDataService.refillTestData()
					.then(function () {
						$scope.vm.refillingInProgress = false;
					});
			};

			modalsService.openConfirm(null, staticContent, staticContent.Title, agreeBtnPostBack);

		}

	}
})();