(function () {
	'use strict';

	angular
		.module('main')
		.controller('MainController', [
			'$scope',
			'DebugSettings',
			'priceStorageDataService',
			MainController]);

	function MainController(
		$scope,
		DebugSettings,
		priceStorageDataService) {

		$scope.vm = {
			showRefillData: DebugSettings.isDeveloper,
			refillingInProgress: false
		}

		$scope.refillTestData = function () {
			$scope.vm.refillingInProgress = true;
			priceStorageDataService.refillTestData()
				.then(function () {
					$scope.vm.refillingInProgress = false;
				});
		}

	}
})();