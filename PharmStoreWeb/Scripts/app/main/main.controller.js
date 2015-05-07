(function () {
	'use strict';

	angular
		.module('main')
		.controller('MainController', [
			'$scope',
			'DebugSettings',
			'priceStorageDataService',
			'modalsService',
			'Upload',
			MainController]);

	function MainController(
		$scope,
		DebugSettings,
		priceStorageDataService,
		modalsService,
		Upload) {

		$scope.$watch('files', function (newVal) {
			if (!newVal) { return; }

			// hide dropzone
			$scope.vm.hideDropZone = true;


			debugger
		});

		$scope.vm = {
			showRefillData: DebugSettings.isDeveloper,
			refillingInProgress: false,
			hideDropZone: true
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