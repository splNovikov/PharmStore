(function () {
	'use strict';

	angular
		.module('modals')
		.constant('modalViewPaths', {
			alerts: {
				drugView: 'components/alertDrugView',
				customerView: 'components/alertCustomerView'
			},
			confirms: {
				exitView: 'components/confirmExitView'
			}
		})
		.constant('modalViewsEnum', {
			alerts: {
				drugView: 1,
				customerView: 2
			}
			,
			confirms: {
				exitView: 3
			}
		})

})();