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
			shapeQuery,
			getColorize,
			getSubstringIndexes,
			replaceStringWithColorized,
			getQueryString,
			getShapeQueryString,
			getQueryParams,
			queryBuilder,
			_getFilteredData,
			//_getFilteredDataByShape,
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
					Title: 'Аспирин ' + id,
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

		getColorize = function (queryArr, price, fieldForColorize, colorizedFieldName) {
			_.each(queryArr, function (q, ind) {

				_.each(price, function (drug) {
					drug[colorizedFieldName] = drug[colorizedFieldName] || drug[fieldForColorize];
					drug[colorizedFieldName] = replaceStringWithColorized(drug[colorizedFieldName], q);
				});
			});

			return price;
		};

		getSubstringIndexes = function (originalString, substring) {
			var a = [], i = -1;
			while ((i = originalString.toLowerCase().indexOf(substring.toLowerCase(), i + 1)) >= 0) {
				a.push(i);
				// for cases like 20202 and substring === "202"
				if (a.length > 1 && substring.length > a[a.length - 1] - a[a.length - 2]) {
					a.pop();
				}
			}
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

		getQueryString = function (queryArr, undefined) {
			var queryString = '';
			_.each(queryArr, function (q, num) {
				if (num === 0) {
					queryString += "WHERE `Title` LIKE ? ";
				} else {
					queryString += "AND `Title` LIKE ? ";
				};
			});

			return queryString || undefined;
		};

		getShapeQueryString = function (queryArr, undefined) {
			var queryString = '';
			_.each(queryArr, function (q, num) {
				queryString += "AND `Form` LIKE ? ";
			});

			return queryString || undefined;
		};

		getQueryParams = function (queryArr) {
			var newQueryArr = [];
			_.each(queryArr, function (q) {
				newQueryArr.push('%' + q + '%');
			});
			return newQueryArr;
		};

		_getFilteredData = function (query, shapeQuery, isUniq) {
			//isUniq - only for lookup dropdown

			// если прилетает снова номер страницы - 1 то начинаем фильтрацию заново
			// склейка данных происходит не здесь - а на том слое где идет вызов.
			// остался limit и offset

			var queryArr = _.compact(query.split(' ')),
				shapeQueryArr = shapeQuery ? _.compact(shapeQuery.split(' ')) : null,
				titleQueryString = getQueryString(queryArr),
				shapeQueryString = getShapeQueryString(shapeQueryArr),
				queryString = "SELECT " + (isUniq ? "DISTINCT " : "") +
										"Id, " +
										"Title, " +
										"Form, " +
										"Manufacturer " +
									"FROM `Drugs` " +
									(titleQueryString ? titleQueryString : "") +
									(shapeQueryString ? shapeQueryString : "") +
									"LIMIT ? " +
									"OFFSET ?;",
				queryParams = _.union(getQueryParams(queryArr), getQueryParams(shapeQueryArr), ["10", "0"]);

			var promise = db.selectCustom(queryString, queryParams)
				.then(function (results) {

					if (results.rows.length === 0) {
						return null;
					}

					var i = 0,
						rowsLength = results.rows.length,
						resultArray = [],
						filtered;

					for (i; i < rowsLength; i++) {
						resultArray.push(results.rows.item(i));
					}

					filtered = getColorize(
						queryArr,
						resultArray,
						'Title',
						'colorizedTitle');

					if (shapeQueryArr) {
						filtered = getColorize(
							shapeQueryArr,
							filtered,
							'Form',
							'colorizedForm');
					}

					if (!isUniq) {
						filtered = sortDrugs(filtered);
					}

					return filtered;

				});

			return {
				promise: promise
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
			initDatabase: _initDatabase,
			refillTestData: _refillTestData,
			setData: _setData,
			getFullData: _getFullData,
			getFilteredData: _getFilteredData,
			getFilteredDataByItem: _getFilteredDataByItem,
			getCustomerById: _getCustomerById
		};

	}

})();
