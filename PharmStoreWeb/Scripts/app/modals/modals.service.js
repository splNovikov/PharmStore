(function () {
	'use strict';

	angular
		.module('modals')
		.factory('modalsService', [
			'$q',
			'$http',
			'$templateCache',
			'$modal',
			'modalViews',
			modalsService]);

	function modalsService(
		$q,
		$http,
		$templateCache,
		$modal,
		modalViews) {

		var _openConfirm,
			_openAlert,
			_getTemplate;


		_openConfirm = function (size, title, confirmViewType, entity, yesCallback, cancelCallback) {

			_getTemplate(modalViews.confirms.mainView)
				.then(function (tmpl) {

					$modal.open({
						template: tmpl,
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
				});
		};

		_openAlert = function (size, alertViewType, entity, title, yesCallback) {

			_getTemplate(modalViews.alerts.mainView)
				.then(function (tmpl) {

					$modal.open({
						template: tmpl,
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
				});
		};

		_getTemplate = function (contentType) {
			var def = $q.defer(),
				template = $templateCache.get(contentType.path);

			if (typeof template === "undefined") {
				$http.get(contentType.path)
					.success(function (data) {
						$templateCache.put(contentType.path, data);
						def.resolve(data);
					});
			} else {
				def.resolve(template);
			}

			return def.promise;
		};

		return {
			openConfirm: _openConfirm,
			openAlert: _openAlert,
			getTemplate: _getTemplate
		};

	}

})();