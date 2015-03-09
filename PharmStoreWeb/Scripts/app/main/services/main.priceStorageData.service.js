(function () {
	'use strict';

	angular
		.module('login')
		.factory('priceStorageDataService', ['localStorageService', priceStorageDataService]);

	function priceStorageDataService(localStorageService) {

		var sortDrugs,
			_setData,
			_getFullData,
			_getFilteredData,
			_getFilteredDataByItem,
			_getCustomerById;


		/*my own sorting - may be I have to improve it*/
		sortDrugs = function (drugs) {
			return _.sortBy(drugs, ['Id', 'Price']);
		};

		_setData = function () {

			var mainPrice, customers;

			// of course, temporary:
			//#region Data
			mainPrice = [
				{
					Id: 1,
					DrugIdCustomer: 32,
					Title: 'Аспирин',
					Form: 'таб. №20',
					Manufacturer: 'Лек. фарма',
					Price: 39.92,
					Customer: {
						Id: 1,
						Name: 'Катрен'
					},
					Multiplicity: 5,
					Balance: 1000,
					DueDate: new Date('2015.11.24')
				},
				{
					Id: 1,
					DrugIdCustomer: 162,
					Title: 'Аспирин',
					Form: 'таб. №20',
					Manufacturer: 'Лек. фарма',
					Price: 27.92,
					Customer: {
						Id: 2,
						Name: 'Протек'
					},
					Multiplicity: 5,
					Balance: 1000,
					DueDate: new Date('2015.11.24')
				},
				{
					Id: 2,
					DrugIdCustomer: 3882,
					Title: 'Аспирин',
					Form: 'таб. №10',
					Manufacturer: 'Лек. фарма',
					Price: 20.12,
					Customer: {
						Id: 1,
						Name: 'Катрен'
					},
					Multiplicity: 10,
					Balance: 2000,
					DueDate: new Date('2015.11.22')
				},
				{
					Id: 3,
					DrugIdCustomer: 32321,
					Title: 'Аспирин',
					Form: 'таб. №50',
					Manufacturer: 'Лек. фарма',
					Price: 101.81,
					Customer: {
						Id: 1,
						Name: 'Катрен'
					},
					DueDate: new Date('2015.11.24')
				}
			]

			customers = [
				{
					Id: 1,
					Name: 'Катрен',
					Address: 'Адрес катрена'
				},
				{
					Id: 2,
					Name: 'Протек',
					Address: 'Адрес протека'
				}
			]

			//#endregion

			localStorageService.set('mainPrice', mainPrice);
			localStorageService.set('customers', customers);
		};

		_getFullData = function () {
			return localStorageService.get('mainPrice');
		};

		_getFilteredData = function (query, isUniq) {
			//isUniq - only for lookup dropdown

			var queryArrOrig,
				queryArr,
				mainPrice,
				filtered,
				sorted


			// 1. split query by space
			queryArrOrig = query.split(' ');
			
			// 2. delete spaces
			queryArr = _.compact(queryArrOrig);

			mainPrice = localStorageService.get('mainPrice');

			filtered = mainPrice;
			_.each(queryArr, function (q) {
				filtered = _.filter(filtered, function (drug) {
					return drug.Title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
				});

				_.each(filtered, function (drug) {
					drug.colorizedTitle = drug.colorizedTitle || drug.Title;

					drug.colorizedTitle = drug.colorizedTitle.replace(new RegExp(q, 'ig'),
						'<span class="colorized">' + q + '</span>');

				});
			});

			if (filtered.length === 0) {
				return null;
			}

			sorted = sortDrugs(filtered);

			if (isUniq) {
				return _.uniq(sorted, function (item) {
					return item.Id;
				});
			} else {
				return sorted;
			}

		};

		_getFilteredDataByItem = function (item) {
			var filtered, sorted;

			filtered = _.filter(localStorageService.get('mainPrice'), function (drug) {
				return drug.Id === item.Id;
			});

			if (filtered.length === 0) {
				return null;
			}

			sorted = sortDrugs(filtered);
			return sorted;
		};

		_getCustomerById = function (id) {
			var found = _.find(localStorageService.get('customers'), function (customer) {
				return customer.Id === id;
			});

			return found;
		};

		return {
			setData: _setData,
			getFullData: _getFullData,
			getFilteredData: _getFilteredData,
			getFilteredDataByItem: _getFilteredDataByItem,
			getCustomerById: _getCustomerById
		};

	}

})();