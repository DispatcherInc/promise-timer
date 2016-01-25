# promise-cache-throttle
Provides caching and throttling of promises.

- **timeify**(func, logFunc, scope) - Returns the function wrapped with timing
- **timeifyAll**(target, logFunc) - Patches all the target's methods with timing

These have similar definitions to bluebird's promisify:
- timeify resembles [bluebird's promisify](http://bluebirdjs.com/docs/api/promise.promisify.html)
- timeifyAll resembles [bluebird's promisifyAll](http://bluebirdjs.com/docs/api/promise.promisifyall.html)