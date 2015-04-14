(function () {
	'use strict';

	angular
		.module('modals')
		.constant('modalViews', {
			basicView:{
				id: 1,
				path: 'components/modalBasicView'
			},
			//modalStaticAlert: {
			//	id: 2,
			//	path: 'TODO!'
			//},
			modalStaticConfirm: {
				id: 3,
				path: 'components/modalStaticConfirmView'
			},
			drugInfo: {
				id: 4,
				path: 'components/modalDrugInfoView'
			},
			customerInfo: {
				id: 5,
				path: 'components/modalCustomerInfoView'
			}
		})

})();