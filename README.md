[![Circle CI](https://circleci.com/gh/DispatcherInc/promise-timer.svg?style=svg&circle-token=c440495658ff31ac5f94f3d984a3425760ef7928)](https://circleci.com/gh/DispatcherInc/promise-timer)

# promise-timer
Provides timing of promises.

- **timeify**(func, logFunc, scope) - Returns the function wrapped with timing
- **timeifyAll**(target, logFunc, options) - Patches all the target's methods with timing

These have similar definitions to bluebird's promisify:
- timeify resembles [bluebird's promisify](http://bluebirdjs.com/docs/api/promise.promisify.html)
- timeifyAll resembles [bluebird's promisifyAll](http://bluebirdjs.com/docs/api/promise.promisifyall.html)

## Examples
```
npm install promise-timer
```
```javascript
var Promise = require('bluebird');
require('promise-timer')(Promise);
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
    /*
    e.g. timeData = 
    {
        start: 1453746070761,
        end: 1453746070914,
        elapsed: 153,
        called: "getDriverAsync(100)"
    }
    */
}, /* optional */ {
    suffix: 'Timed', // or leave empty to override methods,
    filter: function(name, func, target, passesDefaultFilter) { // optional filter
        return _.includes(['getUsersAsync', 'getDriversAsync'], name);
    }
});
```
Or for single functions:
```javascript
var getDriversAsyncTimed = Promise.timeify(API.getDriversAsync, function(fnName, timeData) {
    console.log(timeData, "Called " + fnName);
}, API);
```
