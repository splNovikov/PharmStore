(function () {
	'use strict';

	angular
		.module('modals')
		.factory('modalsService', [
			'$q',
			'$http',
			'$templateCache',
			'$modal',
			'modalViewsEnum',
			'modalViewPaths',
			modalsService]);

	function modalsService(
		$q,
		$http,
		$templateCache,
		$modal,
		modalViewsEnum,
		modalViewPaths) {

		var _openConfirm,
			_openAlert,
			_getTemplate;


		_openConfirm = function (size, title, confirmViewType, entity, yesCallback, cancelCallback) {

			$modal.open({
				templateUrl: 'components/modalConfirm',
				controller: 'ModalsConfirmController',
				size: size,
				resolve: {
					title: function () {
						return title;
					},
					confirmViewType: function () {
						return confirmViewType;
					},
					entity: function () {
						return entity;
					},
					yesCallback: function () {
						return yesCallback;
					},
					cancelCallback: function () {
						return cancelCallback;
					}
				}
			});
		}

		_openAlert = function (size, alertViewType, entity, title, yesCallback) {

			$modal.open({
				templateUrl: 'components/modalAlert',
				controller: 'ModalsAlertController',
				size: size,
				resolve: {
					alertViewType: function () {
						return alertViewType;
					},
					entity: function () {
						return entity;
					},
					title: function () {
						return title;
					},
					yesCallback: function () {
						return yesCallback;
					}
				}
			});
		}

		_getTemplate = function (contentType) {
			var def = $q.defer();

			var template = '';
			switch (contentType) {
				case modalViewsEnum.alerts.drugView:
					template = $templateCache.get(modalViewPaths.alerts.drugView);
					if (typeof template === "undefined") {
						$http.get(modalViewPaths.alerts.drugView)
							.success(function (data) {
								$templateCache.put(modalViewPaths.alerts.drugView, data);
								def.resolve(data);
							});
					} else {
						def.resolve(template);
					}
					break;
				case modalViewsEnum.alerts.customerView:
					template = $templateCache.get(modalViewPaths.alerts.customerView);
					if (typeof template === "undefined") {
						$http.get(modalViewPaths.alerts.customerView)
							.success(function (data) {
								$templateCache.put(modalViewPaths.alerts.customerView, data);
								def.resolve(data);
							});
					} else {
						def.resolve(template);
					}
					break;
				case modalViewsEnum.confirms.exitView:
					template = $templateCache.get(modalViewPaths.confirms.exitView);
					if (typeof template === "undefined") {
						$http.get(modalViewPaths.confirms.exitView)
							.success(function (data) {
								$templateCache.put(modalViewPaths.confirms.exitView, data);
								def.resolve(data);
							});
					} else {
						def.resolve(template);
					}
					break;

			}
			return def.promise;
		}

		return {
			openConfirm: _openConfirm,
			openAlert: _openAlert,
			getTemplate: _getTemplate
		};

	}

})();