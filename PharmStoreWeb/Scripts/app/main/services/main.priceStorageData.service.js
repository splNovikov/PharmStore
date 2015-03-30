(function () {
	'use strict';

	angular
		.module('login')
		.factory('priceStorageDataService', [
			'localStorageService',
			'$webSql',
			'DebugSettings',
			priceStorageDataService]);

	function priceStorageDataService(
		localStorageService,
		$webSql,
		DebugSettings) {

		var sortDrugs,
			db,
			createDrugsTable,
			_initDatabase,
			_refillTestData,
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

		/*my own sorting - may be I have to improve it*/
		sortDrugs = function (drugs) {
			return _.sortBy(drugs, ['Id', 'Price']);
		};

		createDrugsTable = function () {
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

		_initDatabase = function () {
			//Database name //Version number //Text description //Size of database //Creation callback
			db = $webSql.openDatabase('pharmStoreDB', '1.0', 'Test DB', 5 * 1024 * 1024); // 5Mb

			createDrugsTable();
		};

		_refillTestData = function () {

			db.dropTable('Drugs');

			createDrugsTable();

			var mainPrice,
				customers;

			mainPrice = [];

			for (var i = 1; i < 1000; i++) {
				var id = i % 3 ? i : i - 1;
				mainPrice.push({
					Id: id,
					DrugIdCustomer: i * id,
					Title: 'Аспирин_' + id,
					Form: 'таб. №20' + id,
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
					if (DebugSettings.couldLog) {
						console.log('added new test line to Drugs');
					}
				})
			})

		};

		_setData = function () {
			console.info('Data has been setted');
		};

		_getFullData = function () {
			return localStorageService.get('mainPrice');
		};

		getFilterAndColorize = function (queryArr, price, fieldForColorize, colorizedFieldName) {
			var filtered = price;
			_.each(queryArr, function (q, ind) {

				if (ind !== 0) {
					filtered = _.filter(filtered, function (drug, key, arr) {
						return drug[fieldForColorize].toLowerCase().indexOf(q.toLowerCase()) !== -1;
					});
				}

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

			// переходим на web sql!
			// первое - временно отрубаем подкрашивание (разбить метод на 2а)
			// фильтрация может происходить и по форме - помнить об этом
			// зная сколько нужно результатов фильтруем данные. когда количество равно максимму в странице - тормозим фильтрацию. (важно сделать это оптимально чтоб не шерстить по всем данным)
			// когда идет фильтрация - удаляем прошерстенные данные
			// отфильтрованное сохраняем для следующих страниц
			// если прилетает снова номер страницы - 1 то начинаем фильтрацию заново
			// склейка данных происходит не здесь - а на том слое где идет вызов.

			// 1. split query by space and delete spaces
			var queryArr = _.compact(query.split(' ')),

				promise = db.select("Drugs", {
					"Title": {
						"operator": 'LIKE',
						"value": '%' + queryArr[0] + '%'
					}
				}).then(function (results) {

					if (results.rows.length === 0) {
						return null;
					}

					var i = 0,
						rowsLength = results.rows.length,
						resultArray = [],
						filtered,
						sorted;

					for (i; i < rowsLength; i++) {
						resultArray.push(results.rows.item(i));
					}

					filtered = getFilterAndColorize(
										queryArr,
										resultArray,
										'Title',
										'colorizedTitle');

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

				});

			return {
				promise: promise
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
			refillTestData: _refillTestData,
			setData: _setData,
			getFullData: _getFullData,
			getFilteredData: _getFilteredData,
			getFilteredDataByShape: _getFilteredDataByShape,
			getFilteredDataByItem: _getFilteredDataByItem,
			getCustomerById: _getCustomerById
		};

	}

})();
