var _ = require('lodash');

module.exports = function(Promise) {
	var index = {};
	_.extend(index, require('./lib/timeify'));

	if (Promise === undefined) {
		return index;
	} else {
		// Monkey-patch Promise
		_.extend(Promise, index);
		return Promise;
	}
};