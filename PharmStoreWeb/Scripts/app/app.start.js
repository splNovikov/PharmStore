﻿/// <reference path="../libs/angular/angular.js" />

(function () {
	'use strict';

	angular
		.module('pharmStore')
		.factory('appStart', [
			'APP_DEBUG_MODE',
			'modalsService',
			'modalViewsEnum',
			AppStartFactory]);

	function AppStartFactory(
		APP_DEBUG_MODE,
		modalsService,
		modalViewsEnum) {

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
			// cache modal templates //TODO - add to templates main templates
			modalsService.getTemplate(modalViewsEnum.alerts.drugView);
			modalsService.getTemplate(modalViewsEnum.alerts.customerView);

			modalsService.getTemplate(modalViewsEnum.confirms.exitView);
		};

		_start = function () {
			if (!APP_DEBUG_MODE) {
				onCloseTab();
			}
			putTemplatesToCache();
		};

		return {
			start: _start
		};
	}

})();