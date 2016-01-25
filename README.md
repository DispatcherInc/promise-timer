# promise-cache-throttle
Provides caching and throttling of promises.

- **timeify**(func, logFunc, scope) - Returns the function wrapped with timing
- **timeifyAll**(target, logFunc) - Patches all the target's methods with timing

These have similar definitions to bluebird's promisify:
- timeify resembles [bluebird's promisify](http://bluebirdjs.com/docs/api/promise.promisify.html)
- timeifyAll resembles [bluebird's promisifyAll](http://bluebirdjs.com/docs/api/promise.promisifyall.html)

## Examples
```
npm install promise-timer
```
```javascript
var Promise = require('bluebird');
require('timer')(Promise);
var superagent = require('superagent');
var agent = require('superagent-promise')(superagent, Promise);

var API = {
	getUsersAsync: function() { 
		return agent.get('/users/').end();
	},
	getDriversAsync: function() {
		return agent.get('/drivers/').end();
	},
	getDriverAsync: function(driverId) {
		return agent.get('/drivers/' + driverId).end();
	}
};

Promise.timeifyAll(API, function(fnName, timeData) {
	console.log(timeData, "Called " + fnName);
});
```