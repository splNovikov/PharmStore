/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('main')
		.directive('mainBody', mainBodyDirective);

	function mainBodyDirective() {
		return {
			templateUrl: 'main/bodyView',
			replace: true,
			restrict: 'E',
			scope: {
				shownPriceList: '='
			},
			controller: [
				'$scope',
				'$filter',
				'priceStorageDataService',
				'modalsService',
				'modalViews',
				mainBodyController]
		};
	}

	function mainBodyController(
		$scope,
		$filter,
		priceStorageDataService,
		modalsService,
		modalViews) {

		$scope.showDrugFullInfo = function (item) {
			//item.DueDate = $filter('date')(item.DueDate, "dd.MM.yyyy");
			modalsService.openAlert(null, modalViews.alerts.drugView, item, 'инфо: ' + item.Title);
		}

		$scope.showCustomerInfo = function (customer) {
			var customerFull = priceStorageDataService.getCustomerById(customer.Id);
			modalsService.openAlert(null, modalViews.alerts.customerView, customerFull, customer.Name);
		}
	}

})();