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
			modalsService.openModal(null, modalViews.drugInfo, item, item.Title);
		}

		$scope.showCustomerInfo = function (customerId) {

			priceStorageDataService.getCustomerById(customerId).promise
					.then(function (customer) {
						modalsService.openModal(null, modalViews.customerInfo, customer, customer.Name);
					})
		}
	}

})();