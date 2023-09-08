/**
 * Create a hash table with `insert()`, `retrieve()`, and `remove()` methods.
 * Be sure to handle hashing collisions correctly.
 * Set your hash table up to double the storage limit as
 * soon as the total number of items stored is greater than
 * 3/4th of the number of slots in the storage array.
 * Resize by half whenever utilization drops below 1/4.
 */

// This is a "hashing function". You don't need to worry about it, just use it
// to turn any string into an integer that is well-distributed between
// 0 and max - 1
var getIndexBelowMaxForKey = function(str, max) {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
    hash = hash & hash; // Convert to 32bit integer
    hash = Math.abs(hash)
  }
  return hash % max
}

var makeHashTable = function(useProxy = false) {
  var result = {}
  var storage = []
  var storageLimit = 4
  var size = 0

  result.insert = function(key, value) {
    if (typeof key === 'number') key = key.toString()
    var bucketIndex = getIndexBelowMaxForKey(key, storageLimit)
    if (!(storage[bucketIndex])) {
      storage[bucketIndex] = []
    }
    let bucket = storage[bucketIndex]
    for (let i = 0; i < bucket.length; i += 2) {
      if (bucket[i] === key) {
        bucket[i + 1] = value
        return
      }
    }
    bucket.push(key, value)
    size++
    this.checkSize()
  }
  result.retrieve = function(key) {
    if (typeof key === 'number') key = key.toString()
    let bucket = storage[getIndexBelowMaxForKey(key, storageLimit)]
    if (bucket) {
      for (let i = 0; i < bucket.length; i += 2) {
        if (bucket[i] === key) {
          return bucket[i + 1]
        }
      }
    }
  }
  result.remove = function(key) {
    if (typeof key === 'number') key = key.toString()
    let bucket = storage[getIndexBelowMaxForKey(key, storageLimit)];
    if (bucket) {
      for (let i = 0; i < bucket.length; i += 2) {
        if (bucket[i] === key) {
          bucket.splice(i, 2)
          size--
          this.checkSize()
        }
      }
    }
  }
  result.checkSize = function() {
    let newLimit = 0
    if (size > storageLimit * 0.75) {
      newLimit = storageLimit * 2
    } else if (size < storageLimit * 0.25 && storageLimit > 4) {
      newLimit = storageLimit / 2
    }
    if (newLimit !== 0) {
      let oldStorage = storage
      let oldLimit = storageLimit
      storage = []
      storageLimit = newLimit
      for (let i = 0; i < oldLimit; i++){
        if (oldStorage[i]) {
          for (let j = 0; j < oldStorage[i].length; j += 2) {
            this.insert(oldStorage[i][j], oldStorage[i][j + 1])
            size--
          }
        }
      }

    }
  }
  result.getLimit = () => storageLimit
  result.getSize = () => size

  if (useProxy) {
    result = new Proxy(result, hashTableHandler);
  }
  return result
}

const hashTableHandler = {
  get(target, prop, receiver) {
    if (target.hasOwnProperty(prop)) {
      return Reflect.get(...arguments)
    } else {
      return target.retrieve(prop)
    }
  },
  defineProperty(target, prop, descriptor) {
    target.insert(prop, descriptor.value)
    if (target.retrieve(prop) === descriptor.value) {
      return true
    } else {
      return false
    }
  }
}

if (module === undefined) {
  var module = {}
  module.exports = {}
}
module.exports = { makeHashTable: makeHashTable }