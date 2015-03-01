/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('main')
		.directive('mainHeader', mainHeaderDirective);

	function mainHeaderDirective() {
		return {
			templateUrl: 'main/headerView',
			replace: true,
			restrict: 'E',
			scope: {},
			controller: [
				'$scope',
				'modalsService',
				'$state',
				'loginService',
				'localStorageService',
				'priceStorageDataService',
				'modalViews',
				mainHeaderController]
		};
	}

	function mainHeaderController(
		$scope,
		modalsService,
		$state,
		loginService,
		localStorageService,
		priceStorageDataService,
		modalViews) {

		angular.element(document).ready(function () {
			$.material.ripples();
			$.material.input();
		});

		//#region user identity block

		$scope.logOut = function () {
			modalsService.openConfirm('sm', 'Вы уверены что хотите выйти?', modalViews.confirms.exitView, null, function () {
				loginService.logOut();
				$state.go('login');
			});
		}

		var authorizationData = localStorageService.get('authorizationData');

		if (authorizationData) {

			$scope.userBranches = localStorageService.get('userBranches');
			$scope.currentUser = authorizationData.user;

			// set isActive user
			$scope.activeUser = _.find($scope.userBranches, function (branch) {
				return branch.Id === $scope.currentUser.Id;
			});
		}

		$scope.setBranchActive = function (branch) {
			$scope.activeUser = branch;
		};

		//#endregion

		//#region primary search field

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
			//$scope.searchQuery = '';
		}

		//#endregion
	}

})();