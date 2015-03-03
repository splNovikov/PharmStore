/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('lookup')
		.directive('lookup', lookupDirective);

	function lookupDirective() {
		return {
			templateUrl: 'components/lookupView',
			restrict: 'E',
			scope: false,
			controller: [
				'$scope',
				'priceStorageDataService',
				lookupController]
		};
	}

	function lookupController(
		$scope,
		priceStorageDataService) {

		angular.element(document).ready(function () {
			$.material.ripples();
			$.material.input();
		});

		//temporary!!! TODO!!!
		priceStorageDataService.setData();

		$scope.$watch('searchQuery', function (newVal, prevVal, scope) {

			if (!newVal) {
				$scope.clearLookup();
				return;
			}

			$scope.lookupDrugs = priceStorageDataService.getFilteredData(newVal, true);
		});

		$scope.showResultsByItem = function (item) {
			showPrice(priceStorageDataService.getFilteredDataByItem(item));
		}

		$scope.showAllResults = function () {
			if ($scope.searchQuery) {
				showPrice(priceStorageDataService.getFilteredData($scope.searchQuery));
			} else {
				showPrice();
			}
		}

		var showPrice = function (price) {
			$scope.$parent.shownPriceList = price;
			$scope.clearLookup();
		}

		$scope.clearLookup = function () {
			$scope.lookupDrugs = [];
		}

		$scope.navigateOnPopup = function (event) {
			if (!$scope.searchQuery || !$scope.lookupDrugs)
				return;

			if (event.keyCode === 40 || event.keyCode === 38) { // down || up
				if ($scope.lookupDrugs.length === 0) {
					$scope.lookupDrugs = priceStorageDataService.getFilteredData($scope.searchQuery, true);
				} else {
					debugger;
				}
			}
		}

	}

})();