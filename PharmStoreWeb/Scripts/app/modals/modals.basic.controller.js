(function () {
	'use strict';

	angular
		.module('modals')
		.controller('modalsBasicController', [
						'$scope',
						'$modalInstance',

						'nestedView',
						'content',
						'title',
						'agreePostBack',
						modalsBasicController]);


	function modalsBasicController(
						$scope,
						$modalInstance,

						nestedView,
						content,
						title,
						agreePostBack
						) {

		$scope.nestedView = nestedView;
		$scope.content = content;
		$scope.modalTitle = title;


		$scope.closeModal = function () {
			$modalInstance.dismiss('cancel');
		}


		$scope.agreePostBack = function () {
			if (agreePostBack && typeof (agreePostBack) === 'function') {
				agreePostBack();
			}
			$modalInstance.dismiss('close');
		};


		$scope.$on('$locationChangeSuccess', function () {
			$modalInstance.close();
		});


		// afterclose result on cancel and on ok action
		//$modalInstance.result.then(function () {
		//}, function () {
		//});


	};
})();