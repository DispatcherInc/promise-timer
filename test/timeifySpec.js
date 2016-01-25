/* jshint node: true */

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Promise = require('bluebird');
var _ = require('lodash');

var timeify = require('./../lib/timeify');

describe('timeify', function() {

	var API;

	beforeEach(function() {
		API = {
			getUsersAsync: sinon.spy(function() { 
				return Promise.delay(50).then(function() {
					return 'users:' + Math.random();
				});
			}),
			getDriversAsync: sinon.spy(function() {
				return Promise.delay(100).then(function() {
					return 'drivers:' + Math.random();
				});
			}),
			getDriverAsync: sinon.spy(function(driverId) {
				return Promise.delay(150).then(function() {
					return 'driver:' + driverId + ":" + Math.random();
				});
			})
		};
	});

	describe('timeifyAll', function() {
		it('should work', function() {
			var data = {};
			var logger = function(fnName, timeData) {
				data[fnName] = timeData;
			};

			timeify.timeifyAll(API, logger);

			return Promise.all([
				API.getUsersAsync(),
				API.getDriversAsync(),
				API.getDriverAsync(100)
			]).spread(function(response1, response2, response3, response4) {

				var expectBetween = function(value, min, max) {
					expect(value >= min && value <= max).to.be.true;
				};

				expect(data.getUsersAsync).to.exist;
				expect(data.getDriversAsync).to.exist;
				expect(data.getDriverAsync).to.exist;

				expectBetween(data.getUsersAsync.elapsed, 50, 60);
				expectBetween(data.getDriversAsync.elapsed, 100, 110);
				expectBetween(data.getDriverAsync.elapsed, 150, 160);
			});
		});

		it('should accept suffix', function() {
			var data = {};
			var logger = function(fnName, timeData) {
				data[fnName] = timeData;
			};

			timeify.timeifyAll(API, logger, {
				suffix: 'Timed'
			});

			expect(API.getUsersAsyncTimed).to.exist;
			expect(API.getDriversAsyncTimed).to.exist;
			expect(API.getDriverAsyncTimed).to.exist;

			var start = new Date().getTime();
			return Promise.all([
				API.getUsersAsyncTimed(),
				API.getDriversAsyncTimed(),
				API.getDriverAsyncTimed()
			]).spread(function(response1, response2, response3) {
				expect(data.getUsersAsync).to.exist;
				expect(data.getDriversAsync).to.exist;
				expect(data.getDriverAsync).to.exist;
			});
		});

		it('should support filtering', function() {
			var data = {};
			var logger = function(fnName, timeData) {
				data[fnName] = timeData;
			};

			timeify.timeifyAll(API, logger, {
				suffix: 'Timed',
				filter: function(fnName, fn, target, passesDefaultFilter) {
					return _.includes(['getUsersAsync', 'getDriversAsync'], fnName);
				}
			});

			expect(API.getUsersAsyncTimed).to.exist;
			expect(API.getDriversAsyncTimed).to.exist;
			expect(API.getDriverAsyncTimed).to.not.exist;
		});

		it('should not apply to special functions by default', function() {
			API.constructor = function() {};
			API._specialFunction = function() {};

			var data = {};
			var logger = function(fnName, timeData) {
				data[fnName] = timeData;
			};

			timeify.timeifyAll(API, logger, {
				suffix: 'Timed'
			});

			expect(API.getUsersAsyncTimed).to.exist;
			expect(API.constructorTimed).to.not.exist;
			expect(API._specialFunctionTimed).to.not.exist;
		});
	});

});