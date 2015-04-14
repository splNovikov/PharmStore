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
			var staticContent = {
				Title: 'Вы уверены что хотите выйти?',
				Body: 'В этом случае вы потеряете все данные. ' +
					'<br /> TODO: Сделать очистку localStorage и webSQL',
				AgreeBtnName: 'Да'
			},
			agreeBtnPostBack = function () {
				loginService.logOut();
				$state.go('login');
			};

			modalsService.openConfirm(null, staticContent, staticContent.Title, agreeBtnPostBack);
		};

		$scope.setBranchActive = function (branch) {
			$scope.activeUser = branch;
		};


	}

})();