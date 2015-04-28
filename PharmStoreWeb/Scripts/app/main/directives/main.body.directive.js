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
			scope: false,
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

		var forTableData = {
			pageNum: 0,
			query: ''
		},
			showPrice = function (price, isNewSearch, undefined) {
				if (!price) {
					$scope.shownPriceList = undefined;
					return;
				}

				if (!$scope.shownPriceList) {
					$scope.shownPriceList = price;
				} else {
					$scope.shownPriceList = _.union($scope.shownPriceList, price);
				}
			};

		$scope.showDrugFullInfo = function (item) {
			modalsService.openModal(null, modalViews.drugInfo, item, item.Title);
		}

		$scope.showCustomerInfo = function (customerId) {

			priceStorageDataService.getCustomerById(customerId).promise
					.then(function (customer) {
						modalsService.openModal(null, modalViews.customerInfo, customer, customer.Name);
					})
		}

		$scope.showPriceByItem = function (item) {
			$scope.clearDrugsTable();
			priceStorageDataService.getFilteredDataByItem(item).promise
					.then(function (results) {
						showPrice(results);
					});
		};

		$scope.showMaximumPrice = function (query, isNewSearch) {
			if (isNewSearch) {
				$scope.clearDrugsTable();
				forTableData.query = query;
				forTableData.pageNum = 0;
			}
			priceStorageDataService.getMaximumData(query,
														$scope.searchQueryShape,
														50, forTableData.pageNum).promise
							.then(function (results) {
								showPrice(results);
							});
		};

		$scope.clearDrugsTable = function () {
			showPrice();
		};

		$scope.continueLoading = function () {
			forTableData.pageNum += 1;
			$scope.showMaximumPrice(forTableData.query);
		};
	}

})();