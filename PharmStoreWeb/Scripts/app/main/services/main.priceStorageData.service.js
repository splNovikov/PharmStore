(function () {
	'use strict';

	angular
		.module('login')
		.factory('priceStorageDataService', [
			'localStorageService',
			'$webSql',
			priceStorageDataService]);

	function priceStorageDataService(
		localStorageService,
		$webSql) {

		var _initDatabase,
			db,

			sortDrugs,
			_setData,
			_getFullData,
			filteredData,
			shapeQuery,
			getFilterAndColorize,
			getSubstringIndexes,
			replaceStringWithColorized,
			_getFilteredData,
			_getFilteredDataByShape,
			_getFilteredDataByItem,
			_getCustomerById;

		_initDatabase = function () {
			//Database name //Version number //Text description //Size of database //Creation callback
			db = $webSql.openDatabase('pharmStoreDB', '1.0', 'Test DB', 2 * 1024 * 1024);

			db.dropTable('Drugs');

			db.createTable('Drugs', {
				'Id': {
					'type': 'INTEGER',
					//'null': 'NOT NULL'
				},
				'DrugIdCustomer': {
					'type': 'INTEGER',
					//'null': 'NOT NULL'
				},
				'Title': {
					'type': 'TEXT',
					//'null': 'NOT NULL'
				},
				'Form': {
					'type': 'TEXT',
					//'null': 'NOT NULL'
				},
				'Manufacturer': {
					'type': 'TEXT',
					//'null': 'NOT NULL'
				},
				'Price': {
					'type': 'INTEGER',
					//'null': 'NOT NULL'
				},
				'CustomerId': {
					'type': 'INTEGER',
					//'null': 'NOT NULL'
				},
				'Multiplicity': {
					'type': 'INTEGER'
				},
				'Balance': {
					'type': 'INTEGER'
				},
				'DueDate': {
					'type': 'TIMESTAMP'
				}
			})
		};

		/*my own sorting - may be I have to improve it*/
		sortDrugs = function (drugs) {
			return _.sortBy(drugs, ['Id', 'Price']);
		};

		_setData = function () {

			var mainPrice, customers;

			// of course, temporary:
			//#region Data

			mainPrice = [];

			for (var i = 1; i < 1000; i++) {
				var id = i % 3 ? i : i - 1;
				mainPrice.push({
					Id: id,
					DrugIdCustomer: i * id,
					Title: 'Аспирин_' + id,
					Form: 'таб. №20',
					Manufacturer: 'Лек. фарма',
					Price: 39.92,
					CustomerId: 1,
					Multiplicity: 5,
					Balance: 1000,
					DueDate: new Date('2015.11.24')
				})
			}

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

			_.each(mainPrice, function (drug) {
				
				db.insert('Drugs', {
					'Id': drug.Id,
					"DrugIdCustomer": drug.DrugIdCustomer,
					'Title': drug.Title,
					'Form': drug.Form,
					'Manufacturer': drug.Manufacturer,
					'Price': drug.Price,
					'CustomerId': drug.CustomerId,
					'Multiplicity': drug.Multiplicity,
					'Balance': drug.Balance,
					'DueDate': drug.DueDate
				}).then(function (results) {

				})
			})

			//#endregion

		};

		_getFullData = function () {
			return localStorageService.get('mainPrice');
		};

		getFilterAndColorize = function (query, price, fieldForColorize, colorizedFieldName) {
			var queryArrOrig,
				queryArr,
				filtered;

			// 1. split query by space
			queryArrOrig = query.split(' ');

			// 2. delete spaces
			queryArr = _.compact(queryArrOrig);

			filtered = price;
			_.each(queryArr, function (q) {
				filtered = _.filter(filtered, function (drug, key, arr) {
					debugger
					return drug[fieldForColorize].toLowerCase().indexOf(q.toLowerCase()) !== -1;
				});

				_.each(filtered, function (drug) {
					drug[colorizedFieldName] = drug[colorizedFieldName] || drug[fieldForColorize];
					drug[colorizedFieldName] = replaceStringWithColorized(drug[colorizedFieldName], q);
				});
			});

			return filtered;
		};

		getSubstringIndexes = function (originalString, substring) {
			var a = [], i = -1;
			while ((i = originalString.toLowerCase().indexOf(substring.toLowerCase(), i + 1)) >= 0) a.push(i);
			return a;
		};

		replaceStringWithColorized = function (originalString, substring) {
			if (!substring || substring.length === 0) {
				return originalString;
			}

			var substringIndexes = getSubstringIndexes(originalString, substring),
			substringLength = substring.length;


			_.forEachRight(substringIndexes, function (ind) {
				originalString = [originalString.slice(0, ind + substringLength),
				'</span>', originalString.slice(ind + substringLength)].join('');


				originalString = [originalString.slice(0, ind),
				'<span class="colorized">', originalString.slice(ind)].join('');
			})


			return originalString;
		};

		_getFilteredData = function (query, isUniq) {
			//isUniq - only for lookup dropdown

			// перехолим на web sql!
			// первое - временно отрубаем подкрашивание (разбить метод на 2а)
			// фильтрация может происходить и по форме - помнить об этом
			// зная сколько нужно результатов фильтруем данные. когда количество равно максимму в странице - тормозим фильтрацию. (важно сделать это оптимально чтоб не шерстить по всем данным)
			// когда идет фильтрация - удаляем прошерстенные данные
			// отфильтрованное сохраняем для следующих страниц
			// если прилетает снова номер страницы - 1 то начинаем фильтрацию заново
			// склейка данных происходит не здесь - а на том слое где идет вызов.

			var filtered = getFilterAndColorize(
								query,
								localStorageService.get('mainPrice'),
								'Title',
								'colorizedTitle'),
				sorted;

			if (filtered.length === 0) {
				return null;
			}

			sorted = sortDrugs(filtered);

			if (isUniq) {
				filteredData = _.uniq(sorted, function (item) {
					return item.Id;
				});

				if (shapeQuery) {
					return _getFilteredDataByShape(shapeQuery);
				} else {
					return filteredData;
				}
			} else {
				return sorted;
			}

		};

		_getFilteredDataByShape = function (query) {
			shapeQuery = query;
			if (!filteredData) return null;

			var colorizedFieldName = 'colorizedForm',
				filtered;

			_.each(filteredData, function (drug) {
				if (drug[colorizedFieldName]) {
					drug[colorizedFieldName] = null;
				}
			});

			if (!query) {
				return filteredData;
			}

			filtered = getFilterAndColorize(query, filteredData, 'Form', colorizedFieldName);

			if (filtered.length === 0) {
				return null;
			}

			return filtered;
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
			initDatabase: _initDatabase,
			setData: _setData,
			getFullData: _getFullData,
			getFilteredData: _getFilteredData,
			getFilteredDataByShape: _getFilteredDataByShape,
			getFilteredDataByItem: _getFilteredDataByItem,
			getCustomerById: _getCustomerById
		};

	}

})();