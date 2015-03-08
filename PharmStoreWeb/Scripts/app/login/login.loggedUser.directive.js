/// <reference path="../../angular.js" />
(function () {
	'use strict';

	angular
		.module('login')
		.directive('loggedUser', loggedUserDirective);

	function loggedUserDirective() {
		return {
			templateUrl: 'login/loggedUserView',
			restrict: 'E',
			scope: false,
			controller: [
				'$scope',
				'$state',
				'loginService',
				'modalsService',
				'modalViews',
				loggedUserController]
		};
	}

	function loggedUserController(
		$scope,
		$state,
		loginService,
		modalsService,
		modalViews) {

		var authorizationData = loginService.getUserData();

		if (authorizationData) {
			$scope.userData = $scope.userData || {};

			$scope.userData.userBranches = loginService.getUserBranches();
			$scope.userData.currentUser = authorizationData.user;

			// set isActive user
			$scope.activeUser = _.find($scope.userData.userBranches, function (branch) {
				return branch.Id === $scope.userData.currentUser.Id;
			});
		};

		$scope.logOut = function () {
			modalsService.openConfirm('sm', 'Вы уверены что хотите выйти?', modalViews.confirms.exitView, null, function () {
				loginService.logOut();
				$state.go('login');
			});
		};

		$scope.setBranchActive = function (branch) {
			$scope.activeUser = branch;
		};


	}

})();