// Load the pify package

const pify = require('pify');

// Pify is used to promisify the callback functions
// Here we will promisify the callback functions like readFile that are present in the fs core
//module of the Node.js Runtime.
const fs = pify(require('fs'));

/**
 *
 * @param {*} timeout The duration for the timeout
 * @desc This will return a promise and will resolve with some random value after some random seconds.
 */
const wait = timeout => {
  return new Promise(resolve => {
    return setTimeout(() => {
      resolve(Math.random());
    }, timeout);
  });
};

/**
 *
 * @param {*} generatorFunction generator function that will hold the required asynchronous code.
 * @desc It uses the concept of generators. With the generatorObject that we get from the invocation
 * of the generatorFunction we will create an iterator on that, which will return the same object
 * that has the structure of form { value: Any, done: true/false } which we saw in the slides. For understanding
 * this refer to the videos on the channel. And this function will then keep on generating values until the done value
 * is false. Once done becomes true, we will immediately return from the callback otherwise keep generating more and more
 * values. To visualize this, check the video on Iterators and Generators and try to relate this with the diagrams that I
 * used for demonstration.
 */
function async_(generatorFunction) {
  const generatorObject = generatorFunction();
  const iterator = generatorObject[Symbol.iterator]();
  const { value: promise } = iterator.next();

  return promise.then(function loop(data) {
    const yieldedObject = iterator.next(data);
    const done = yieldedObject.done;
    if (done) {
      return;
    }
    const nextPromise = yieldedObject.value;
    return nextPromise.then(loop);
  });
}


 // NOW SEE THE POWER OF OUR ABOVE FUNCTION WHICH DOES THE SAME THING WHAT ASYNC AWAIT DOES UNDER
 // THE HOOD :)
async_(function*() {
  console.time(); // Start the time
  const value = yield wait(5000); // Pause until the value is returned, once the value is there RESUME !!
  console.log(`value is ${value}`);
  const valueTwo = yield wait(2000); // Same pause again, once the value is there RESUME !!
  console.timeEnd(); // End of the time, we get the time logged to the console, that took for these two above async operations
  console.log(value, valueTwo); // Log the values that we got in the console
  // Read the file asynchronously using the promisified pify version of the readFile method
  const fileContent = yield fs.readFile('sample.txt', 'utf-8');
  console.log(fileContent);
}).then(() => console.log('Async Await is now done'))
.catch(console.error);

wait(2000).then(console.log)
