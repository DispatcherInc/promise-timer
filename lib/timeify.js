var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var util = require('./util');

var DEFAULT_OPTIONS = {
	suffix: "",
	filter: util.defaultFilter
};

var timeify = function(funcAsync, logFunc, scope) {
	if (typeof funcAsync !== 'function') {
		throw new Error("Must be a function");
	}
	if (typeof logFunc !== 'function') {
		throw new Error("Must provide log function");
	}

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

var timeifyAll = function(target, logFunc, options) {
	options = _.defaults({}, options, DEFAULT_OPTIONS);

	if (typeof options.context !== 'object') {
		options.context = target;
	}
	
	util.forEachFilteredFunction(target, options, function(fn, fnName) {
		var newFnName = fnName + options.suffix;
		target[newFnName] = timeify(fn, function(timeData) {
			timeData.called = fnName + "(" + timeData.args.join(",") + ")";
			logFunc(fnName, timeData);
		}, target);
	});

	return target;
};

module.exports.timeify = timeify;
module.exports.timeifyAll = timeifyAll;
