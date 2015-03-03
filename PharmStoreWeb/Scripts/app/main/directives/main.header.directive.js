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
		modalViews) {

		//#region user identity block

		$scope.logOut = function () {
			modalsService.openConfirm('sm', 'Вы уверены что хотите выйти?', modalViews.confirms.exitView, null, function () {
				loginService.logOut();
				$state.go('login');
			});
		}

		// TODO - переместить в сервис
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

	}

})();