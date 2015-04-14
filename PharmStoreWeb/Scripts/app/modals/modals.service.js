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
			'DebugSettings',
			modalsService]);

	function modalsService(
		$q,
		$http,
		$templateCache,
		$modal,
		modalViews,
		DebugSettings) {

		var _openModal,
			_openConfirm,
			_getTemplate;

		_openModal = function (size, nestedView, content, title, agreePostBack) {
			_getTemplate(modalViews.basicView)
				.then(function (tmpl) {
					$modal.open({
						template: tmpl,
						controller: 'modalsBasicController',
						size: size,
						resolve: {
							nestedView: function () {
								return nestedView;
							},
							content: function () {
								return content;
							},
							title: function () {
								return title;
							},
							agreePostBack: function () {
								return agreePostBack;
							}
						}
					});
				})
		};

		_openConfirm = function (size, staticContent, title, agreePostBack) {
			_openModal(size, modalViews.modalStaticConfirm, staticContent, title, agreePostBack);
		};

		_getTemplate = function (contentType) {
			var def = $q.defer(),
				template = $templateCache.get(contentType.path);

			if (typeof template === "undefined") {
				$http.get(contentType.path)
					.success(function (data) {
						$templateCache.put(contentType.path, data);
						def.resolve(data);

						if (DebugSettings.couldLog) {
							console.info('Loaded template from server: ' + contentType.path);
						}
					});
			} else {
				def.resolve(template);
			}

			return def.promise;
		};

		return {
			openModal: _openModal,
			openConfirm: _openConfirm,
			getTemplate: _getTemplate
		};

	}

})();