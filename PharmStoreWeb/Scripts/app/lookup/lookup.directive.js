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

		$scope.$watch('searchQuery', function (newVal, prevVal, scope) {
			if (!newVal) {
				$scope.lookup.clearLookup();
				return;
			}

			priceStorageDataService.getFilteredData(newVal, true).promise
				.then(function (result) {
					$scope.lookupDrugs = result;
				})

			
		});

		$scope.$watch('searchQueryShape', function (newVal, prevVal, scope) {
			$scope.lookupDrugs = priceStorageDataService.getFilteredDataByShape($scope.lookupDrugs, newVal);
		});

		var showPrice = function (price) {
			$scope.$parent.shownPriceList = price;
			$scope.lookup.clearLookup();
		};

		var selectByArrows = function (event, selectedIdx) {
			//1. find selected is exist
			var lookupLength = $scope.lookupDrugs.length;

			//2. if selected is not exists
			if (!_.isNumber(selectedIdx)) {
				if (event.keyCode === 40) {
					$scope.lookupDrugs[0].isSelected = true;
				} else if (event.keyCode === 38) {
					$scope.lookupDrugs[lookupLength - 1].isSelected = true;
				}
			} else {
				if (lookupLength === 1) return;

				$scope.lookupDrugs[selectedIdx].isSelected = false;

				// 3. if selected is exists
				if (event.keyCode === 40) {
					if (selectedIdx + 1 !== lookupLength) {
						$scope.lookupDrugs[selectedIdx + 1].isSelected = true;
					} else {
						$scope.lookupDrugs[0].isSelected = true;
					}
				} else if (event.keyCode === 38) {
					if (selectedIdx !== 0) {
						$scope.lookupDrugs[selectedIdx - 1].isSelected = true;
					} else {
						$scope.lookupDrugs[lookupLength - 1].isSelected = true;
					}
				}
			}
		};

		$scope.lookup = {
			showResultsByItem: function (item) {
				showPrice(priceStorageDataService.getFilteredDataByItem(item));
			},

			showResults: function () {
				// check if there is no selected data by arrows
				var selectedDrug = _.find($scope.lookupDrugs, function (drugItem) {
					return drugItem.isSelected;
				});

				if (selectedDrug) {
					showPrice(priceStorageDataService.getFilteredDataByItem(selectedDrug));
					return;
				}

				if ($scope.searchQuery) {
					showPrice(priceStorageDataService.getFilteredData($scope.searchQuery));
				} else {
					showPrice();
				}
			},

			clearLookup: function () {
				$scope.lookupDrugs = [];
			},

			navigateOnPopup: function (event) {
				if (!$scope.searchQuery || !$scope.lookupDrugs)
					return;

				var selectedIdx,
					selectedDrug = _.find($scope.lookupDrugs, function (drugItem, drugIdx) {
						if (drugItem.isSelected) { selectedIdx = drugIdx; };
						return drugItem.isSelected;
					});

				if (event.keyCode === 27) { // Esc
					if (selectedDrug) { selectedDrug.isSelected = false; }
				}

				if (event.keyCode === 40 || event.keyCode === 38) { // down || up
					if ($scope.lookupDrugs.length === 0) {
						$scope.lookupDrugs = priceStorageDataService.getFilteredData($scope.searchQuery, true);
						selectByArrows(event, selectedIdx);
					} else {
						selectByArrows(event, selectedIdx);
					}
				}
			}
		}

	}

})();