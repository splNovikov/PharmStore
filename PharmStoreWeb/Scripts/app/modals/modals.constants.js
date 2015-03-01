(function () {
	'use strict';

	angular
		.module('modals')
		.constant('modalViews', {
			alerts: {
				mainView: { path: 'components/modalAlert', num: 1 },
				drugView: { path: 'components/alertDrugView', num: 2 },
				customerView: { path: 'components/alertCustomerView', num: 3 }
			},
			confirms: {
				mainView: { path: 'components/modalConfirm', num: 4 },
				exitView: { path: 'components/confirmExitView', num: 5 }
			}
		})

})();