var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var timeify = function(funcAsync, logFunc, scope) {
	return _.wrap(funcAsync, function(func) {
		var args = _.values(arguments).slice(1);
		var start = moment();
		return func.apply(scope, args)
			.then(function(response) {
				var end = moment();
				var elapsed = end.diff(start);
				logFunc({
					args: args,
					elapsed: elapsed,
					start: start,
					end: end
				});
				return Promise.resolve(response);
			})
			.catch(function(err) {
				var end = moment();
				var elapsed = end.diff(start);
				logFunc({
					args: args,
					elapsed: elapsed,
					start: start,
					end: end,
					err: err
				});
				return Promise.reject(err);
			});
	});
};

var timeifyAll = function(target, logFunc) {
	_.each(target, function(fn, fnName) {
		if (typeof fn !== 'function') {
			return;
		}
		target[fnName] = timeify(fn, function(timeData) {
			timeData.called = fnName + "(" + timeData.args.join(",") + ")";
			logFunc(fnName, timeData);
		}, target);
	});
};

module.exports.timeify = timeify;
module.exports.timeifyAll = timeifyAll;
