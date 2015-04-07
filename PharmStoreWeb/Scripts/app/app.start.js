/// <reference path="../libs/angular/angular.js" />

(function () {
	'use strict';

	angular
		.module('pharmStore')
		.factory('appStart', [
			'DebugSettings',
			'modalsService',
			'modalViews',
			'priceStorageDataService',
			AppStartFactory]);

	function AppStartFactory(
		DebugSettings,
		modalsService,
		modalViews,
		priceStorageDataService) {

		var onCloseTab,
			putTemplatesToCache,
			_start;

		// event listener of close the browser tab
		onCloseTab = function (event) {
			window.onbeforeunload = function (event) {
				var message = 'Sure you want to leave?';
				if (typeof event == 'undefined') {
					event = window.event;
				}
				if (event) {
					event.returnValue = message;
				}
				return message;
			}
		};

		putTemplatesToCache = function () {
			// push modal templates to cache
			_.each(modalViews.alerts, function (n, key) {
				modalsService.getTemplate(modalViews.alerts[key]);
			});

			_.each(modalViews.confirms, function (n, key) {
				modalsService.getTemplate(modalViews.confirms[key]);
			});
		};

		_start = function () {
			if (!DebugSettings.isDeveloper) {
				onCloseTab();
			}
			putTemplatesToCache();
			priceStorageDataService.initDatabase();
		};

		return {
			start: _start
		};
	}

})();