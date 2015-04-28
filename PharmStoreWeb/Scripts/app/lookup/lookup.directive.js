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

		var ctrlVariables = {
			queryLimit: 15,
			lookupPageNum: 0,
			stringsBeforeLoadingNext: 2,
			linesAfterScrolling: 7,
			defaultLinesAfterScrolling: 7
		}

		$scope.$watch('searchQuery', function (newVal, prevVal, scope) {
			if (!newVal) {
				$scope.lookup.clearLookup();
				return;
			}
			ctrlVariables.lookupPageNum = 0;
			resetScrolling();

			priceStorageDataService.getFilteredData(newVal, $scope.searchQueryShape,
				ctrlVariables.queryLimit, ctrlVariables.lookupPageNum).promise
				.then(function (result) {
					$scope.lookupDrugs = result;
				})
		});

		$scope.$watch('searchQueryShape', function (newVal, prevVal, scope) {
			if (!$scope.searchQuery) {
				return;
			}
			ctrlVariables.lookupPageNum = 0;
			resetScrolling();

			priceStorageDataService.getFilteredData($scope.searchQuery, newVal,
				ctrlVariables.queryLimit, ctrlVariables.lookupPageNum).promise
				.then(function (result) {
					$scope.lookupDrugs = result;
				})
		});

		var selectByArrows = function (event, selectedIdx) {
			var lookupLength = $scope.lookupDrugs.length;

			if (!$scope.lookupDrugs || lookupLength === 0) {
				priceStorageDataService.getFilteredData($scope.searchQuery, $scope.searchQueryShape,
					ctrlVariables.queryLimit, ctrlVariables.lookupPageNum).promise
				.then(function (result) {
					$scope.lookupDrugs = result;
					$scope.lookupDrugs[0].isSelected = true;
				})
			} else {
				// if selected is not exists
				if (!_.isNumber(selectedIdx)) {
					if (event.keyCode === 40) {
						$scope.lookupDrugs[0].isSelected = true;
					}
				} else {
					if (lookupLength === 1) return;

					// 3. if selected is exists
					if (event.keyCode === 40) {

						if (selectedIdx === lookupLength - 1) {
							return;
						}

						$scope.lookupDrugs[selectedIdx].isSelected = false;

						if (selectedIdx === lookupLength - ctrlVariables.stringsBeforeLoadingNext) {
							$scope.lookup.continueLoading();
						}
						// auto-scroll
						if (selectedIdx > ctrlVariables.linesAfterScrolling) {
							ctrlVariables.linesAfterScrolling = selectedIdx;
							$scope.lookup.linesToScroll = selectedIdx - 8;
						}

						$scope.lookupDrugs[selectedIdx + 1].isSelected = true;

					} else if (event.keyCode === 38) {

						$scope.lookupDrugs[selectedIdx].isSelected = false;

						// auto-scroll
						if (selectedIdx <= ctrlVariables.linesAfterScrolling - 8) {
							ctrlVariables.linesAfterScrolling = selectedIdx + 8;
							$scope.lookup.linesToScroll = selectedIdx - 1;
						}

						if (selectedIdx !== 0) {
							$scope.lookupDrugs[selectedIdx - 1].isSelected = true;
						} else {
							$scope.lookupDrugs[0].isSelected = true;
						}
					}
				}
			}
		};

		var resetScrolling = function () {
			$scope.lookup.linesToScroll = 0;
			ctrlVariables.linesAfterScrolling = ctrlVariables.defaultLinesAfterScrolling;
		}

		$scope.lookup = {
			linesToScroll: false,

			showResultsByItem: function (item) {
				// main.body.directive.js
				$scope.showPriceByItem(item);
				$scope.lookup.clearLookup();
			},

			showResults: function () {
				// check if there is no selected data by arrows
				var selectedDrug = _.find($scope.lookupDrugs, function (drugItem) {
					return drugItem.isSelected;
				});

				if (selectedDrug) {
					$scope.lookup.showResultsByItem(selectedDrug);
					return;
				}

				if ($scope.searchQuery) {
					// main.body.directive.js
					$scope.showMaximumPrice($scope.searchQuery, true);
				} else {
					// main.body.directive.js
					$scope.clearDrugsTable();
				}
				$scope.lookup.clearLookup();
			},

			clearLookup: function () {
				$scope.lookupDrugs = [];
				ctrlVariables.lookupPageNum = 0;
			},

			continueLoading: function () {
				ctrlVariables.lookupPageNum += 1;

				priceStorageDataService.getFilteredData($scope.searchQuery, $scope.searchQueryShape,
					ctrlVariables.queryLimit, ctrlVariables.lookupPageNum).promise
					.then(function (result) {
						$scope.lookupDrugs = _.union($scope.lookupDrugs, result);
					})
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
					$scope.lookup.clearLookup();
				}

				if (event.keyCode === 40 || event.keyCode === 38) { // down || up
					selectByArrows(event, selectedIdx);
				}
			}
		}

	}

})();