(function () {
	'use strict';

	angular
		.module('modals')
		.constant('modalViewPaths', {
			alerts: {
				mainView: 'components/modalAlert',
				drugView: 'components/alertDrugView',
				customerView: 'components/alertCustomerView'
			},
			confirms: {
				mainView: 'components/modalConfirm',
				exitView: 'components/confirmExitView'
			}
		})
		.constant('modalViewsEnum', {
			alerts: {
				mainView: 1,
				drugView: 2,
				customerView: 3
			}
			,
			confirms: {
				mainView: 4,
				exitView: 5
			}
		})

})();