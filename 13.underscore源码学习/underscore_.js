/* eslint-disable */
(function () {
  var root = this;
  // 保存之前的_的变量，防止被覆盖
  var previousUnderscore = root._;

  // Array, Object, Function原型的引用，方便使用
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;
  // 原生的方法
  var nativeIsArray = ArrayProto.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind,
    nativeCreate = Object.create;
  // 空构造函数
  var Ctor = function () {};
  // 构造函数: 把一个obj构造为一个_的实例对象，对象的_wrapped属性保存着原来的obj
  var _ = function (obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
  // 如果是node环境，把underscore定义为一个模块
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && moudule.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
  // 版本号
  _.VERSION = '1.8.3'
  // 优化回调函数，因为call比apply更快一点
  var optimizeCb = function (func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function (value) {
          return func.call(contex, value);
        };
      case 2:
        return function (value, other) {
          return func.call(context, value, other)
        };
      case 3:
        return function (value, index, collection) {
          return func.call(context, value, index, collection)
        };
      case 4:
        return function (accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection)
        };
    }
    return function () {
      return func.apply(context, arguments)
    };
  };
  // 内部函数，把各种情况的value转换为函数
  var cb = function (value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  // 同cb,生成一个迭代者函数，用于迭代map,every,find,filter...
  _.iteratee = function (value, context) {
    return cb(value, context, Infinity);
  };
  // 内部函数，用于创建_.extend, _.extendOwn, _.defaults, 遍历keys，把source对象的属性复制给obj
  var createAssigner = function (keysFunc, undefinedOnly) {
    return function (obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] == void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };
  // '继承'对象
  var baseCreate = function (prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };
  // 给定一个属性，返回一个属性匹配器
  var property = function (key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  };
  // 最大数组索引 === Number.MAX_SAFE_INTEGER,能精确表示的最大数字
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  // 获取传入obj的length属性的值
  var getLength = property('length');
  // 根据length属性判断是否是类数组array-like
  var isArrayLike = function (collection) {
    var length = collection.length;
    return typeof length == 'number' && length > 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // 迭代obj的每个值，返回obj
  _.each = function (obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj)
      }
    } else {
      var keys = _.keys(obj)
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };
  // 迭代每个值，返回包含结果的数组
  _.map = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj);
    var length = (keys || obj).length;
    var results = Array(length);

    for (var i = 0; i < length; i++) {
      var currentKey = keys ? keys[i] : i;
      results[i] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }
  // 用于创建_.reduce, _.reduceRight
  function createReduce(dir) {
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function (obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4)
      var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    }
  }

  // 把数组或对象的每个值通过iteratee归并为一个值
  _.reduce = _.foldl = _.inject = createReduce(1);
  _.reduceRight = _.foldr = createReduce(-1);
  // 迭代查找符合predicate的值
  _.find = _.detect = function (obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context)
    } else {
      key = _.findKey(obj, predicate, context)
    }
    if (key !== void 0 && key !== -1) {
      return obj[key];
    }
  };
  // 迭代每个值，符合predicate的放入数组并返回
  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function (value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    })
    return results;
  };
  // 调用_.filter返回不符合predicate的值的数组
  _.reject = function (obj, predicate, context) {
    return _.filter(obj, _.negate(predicate), context);
  };
  // 迭代obj，只要obj中有一个值不符合predicate就返回false
  _.every = _.all = function (obj, predicate, context) {
    predicate = cb(predicate, context)
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }
  // 迭代obj，只要obj中有一个值符合predicate就返回true
  _.some = _.any = function (obj, predicate, context) {
    predicate = cb(predicate, context)
    var keys = !isArrayLike(ojb) && _.keys(obj),
      length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }
  // 判断obj中是否包含某个值
  _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  }
  // 调用集合中每个value的method
  _.invoke = function (obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function (value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };
  // 提取对象数组的某个key对应的值
  _.pluck = function (obj, key) {
    return _.map(obj, _.property(key));
  };
  // 查找属性匹配attrs的值
  _.where = function (obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };
  // 返回匹配给定attrs的第一个值
  _.findWhere = function (obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  }
  // 返回最大值
  _.max = function (obj, iteratee, context) {
    var result = -Infinity,
      lastComputed = -Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) result = value;
      }
    } else {
      iteratee = cb(iteratee);
      _.each(obj, function (value, index, list) {
        computed = iteratee(value);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      })
    }
    return result;
  };
  // 返回最小值
  _.min = function (obj, iteratee, context) {
    var result = Infinity,
      lastComputed = Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i]
        if (value < result) result = value
      }
    } else {
      iteratee = cb(iteratee);
      _.each(obj, function (value, index, list) {
        computed = iteratee(value);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      })
    }
    return result;
  }
  // 乱序数组
  _.shuffle = function (obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  }
  // 返回一个随机样本，n是样本数量
  _.sample = function (obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n))
  }
  // 对集合按照给定方法排序
  _.sortBy = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_map(obj, function (value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      }
    }).sort(function (left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1
        if (a < b || b === void 0) return -1
      }
      return left.index - right.index;
    }), 'value');
  };
  // 生成一个分组函数，遍历obj的key、处理key，传入behavior，形成分组
  var group = function (behavior) {
    return function (obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function (value, index) {
        var key = iteratee(value, index, obj)
        behavior(result, value, key)
      })
    }
  }
  // 类似excel的分类汇总，根据iteratee后的key分类
  _.groupBy = group(function (result, value, key) {
    if (_.has(result, key)) result[key].push(value);
    else result[key] = [value];
  })
  // 类似groupBy，迭代每个obj中的value，放在一个{ key: value }对象中
  _.indexBy = group(function (result, value, key) {
    result[key] = value;
  })
  // 统计根据key查找到value的数量
  _.countBy = group(function (result, value, key) {
    if (_.has(result, key)) result[key]++;
    else result[key] = 1;
  })
  // 把数组，类数组，对象转换为数组
  _.toArray = function (obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj)
    if (isArrayLike(obj)) return _.map(obj, _.identity); // 遍历obj，直接return value，形成一个新数组
    return _.values(obj);
  };
  // 类数组或对象的length
  _.size = function (obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };
  // 由predicate做判断分成两组
  _.partition = function (obj, predicate, context) {
    predicate = cb(predicate, context)
    var pass = [],
      fail = [];
    _.each(obj, function (value, index, obj) {
      (predicate(value) ? pass : fail).push(value)
    })
    return [pass, fail]
  };

  // Array Functions
  // 取得数组的前n个元素
  _.first = _.head = _.take = function (array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n)
  }

  // 去掉后n个，返回前面length-n个
  _.initial = function (array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }
  // 取得数组后n个元素
  _.last = function (array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  }
  // 丢掉数组前n个元素，取得后length-n个
  _.rest = _.tail = _.drop = function (array, n, guard) {
    return slice.call(array, n == null || grard ? 1 : n)
  }
  // 去掉数组的falsy值
  _.compact = function (array) {
    return _.filter(array, _.identity);
  }
  // 数组扁平化调用的内部函数
  var flatten = function (input, shallow, strict, startIndex) {
    var output = [],
      idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0,
          len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }
  // 扁平化数组
  _.flatten = function (array, shallow) {
    return flatten(array, shallow, false);
  };
  // 移除数组中给定的value, 与difference的区别类似call和apply
  _.without = function (array) {
    return _.difference(array, slice.call(arguments, 1));
  };
  // 数组去重
  _.uniq = _.unique = function (array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }
  // 多个数组的并集
  _.union = function () {
    return _.uniq(flatten(arguments, true, true))
  }
  // 交集
  _.intersection = function (array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      // 如果结果集中已经包含此元素了，跳过此次遍历
      if (_.contains(result, item)) continue;
      // 遍历后面的数组，如果不包含，则提前终止，说明此元素不是交集元素
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };
  // 差集
  _.difference = function (array) {
    // 把其他数组展开到一个数组
    var rest = flatten(arguments, true, true, 1)
    // 过滤不在rest中的值
    return _.filter(array, function (value) {
      return !_.contains(rest, value);
    });
  };
  // 二维数组矩阵变换
  _.zip = function () {
    return _.unzip(arguments)
  }
  // example _.unzip([["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]);
  // => [['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]]
  _.unzip = function (array) {
    // 遍历array中每个obj的长度，返回长度最大的长度
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);
    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index); // _.pluck提取每个属性对应的值，返回数组
    }
    return result;
  }
  // 数组转换为对象
  // example _.object(['moe', 'larry', 'curly'], [30, 40, 50]); => {moe: 30, larry: 40, curly: 50}
  _.object = function (list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i]
      } else {
        result[list[i][0]] = list[i][1] // 二维数组情况 _.object([['moe', 30], ['larry', 40], ['curly', 50]]);
      }
    }
    return result;
  }
  // 内部方法，用于创建findIndex findLastIndex方法
  function createPredicateIndexFinder(dir) {
    return function (array, predicate, context) {
      predicate = cb(predicate, context)
      var length = getLength(array)
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1
    }
  }

  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);
  // 二分查找某个值的索引位置
  _.sortedIndex = function (array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2)
      if (iteratee(array[mid]) < value) low = mid + 1;
      else high = mid;
    }
    return low;
  };
  // 内部方法，用于创建indexOf lastIndexOf
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function (array, item, idx) {
      var i = 0,
        length = getLength(array);
      // 修正查找起始点
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) { // 对于排序的数组用_.sortedIndex查找
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      // 对于NaN需要用_.findIndex查找
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx > 0 ? idx + i : -1
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex)
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex)
  // 生成一个等差数组，限定范围和差值
  _.range = function (start, stop, step) {
    if (stop == null) {
      start = 0;
      stop = start || 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      result[idx] = start;
    }
    return range;
  }

  // Function Functions

  var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  }

  _.bind = function (func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2)
    var bound = function () {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)))
    }
    return bound;
  }

  _.partial = function (func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function () {
      var position = 0,
        length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === '_' ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[positon++]);
      return executeBound(func, bound, this, this, args)
    }
    return bound;
  }

  _.bindAll = function (obj) {
    var i, length = arguments.length,
      key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  _.memoize = function (func, hasher) {
    var memoize = function (key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    }
    memoize.cache = {}
    return memoize;
  }

  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait)
  }

  _.defer = _.partial(_.delay, _, 1);

  _.throttle = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
      var previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    }
    return function () {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    }
  }

  _.debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function () {
      var last = _.now - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    }
    return function () {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    }
  }

  _.wrap = function (func, wrapper) {
    return _.partial(wrapper, func);
  }

  _.negate = function (predicate) {
    return function () {
      !predicate.apply(this, arguments);
    }
  }

  _.compose = function () {
    var args = arguments;
    var start = args.length - 1;
    return function () {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  _.after = function (times, func) {
    return function () {
      if (--times < 1) {
        func.apply(this, arguments)
      }
    }
  }

  _.before = function (times, func) {
    var memo;
    return function () {
      if (--times > 0) {
        memo = func.apply(this, arguments)
      }
      if (time <= 1) func = null;
      return memo;
    }
  }

  _.once = _.partial(_.before, 2)

  // Object Functions
  var hasEnumBug = !{
    toString: null
  }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'hasOwnProperty', 'toString', 'toLocalString', 'propertyIsEnumerable']

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = collectNonEnumProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  _.keys = function (obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
      if (_.has(obj, key)) keys.push(key);
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  _.allKeys = function (obj) {
    if (!isObject(obj)) return [];
    var keys = []
    for (var key in obj) keys.push(key);
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  _.values = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values.push(obj[keys[i]]);
    }
    return values;
  }

  _.mapObject = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
      length = keys.length,
      results = {},
      currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj)
    }
    return results;
  }

  _.pairs = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  }

  _.invert = function (obj) {
    var keys = _.keys(obj)
    var result = {}
    for (var i = 0, length = keys.length; i < length; i++) {
      results[obj[keys[i]]] = keys[i]
    }
    return result;
  }

  _.functions = function (obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  }

  _.extend = createAssigner(_.allKeys);
  _.extendOwn = _.assign = createAssigner(_.keys);
  _.defaults = createAssigner(_allKeys, true);

  _.findKey = function (obj, predicate, context) {
    predicate = cb(predicate, context)
    var keys = _.keys(obj),
      key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i]
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  _.pick = function (object, oiteratee, context) {
    var result = {},
      obj = object,
      iteratee, keys;
    if (obj === null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function (value, key, obj) {
        return key in obj;
      };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i],
        value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

  _.omit = function (obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function (value, key) {
        return !_.contains(keys, key);
      }
    }
    return _.pick(obj, iteratee, context);
  }

  _.create = function (prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  }

  _.clone = function (obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  _.tap = function (obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  _.isMatch = function (object, attrs) {
    var keys = _.keys(attrs),
      length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  var eq = function (a, b, aStack, bStack) {
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    if (a == null || b == null) return a === b;
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      case '[object RegExp]':
      case '[object String]':
        return '' + a === '' + b;
      case '[object Number]':
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) &&
        ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      if (aStack[length] === a) return bStack[length] === b;
    }
    aStack.push(a);
    bStack.push(b)

    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      var keys = _.keys(a),
        key;
      length = keys.length;
      if (_.keys(b).length !== length) return false;
      while (length--) {
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }

    aStack.pop();
    bStack.pop();
    return true;
  }

  _.isEqual = function (a, b) {
    return eq(a, b);
  }

  _.isEmpty = function (obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  }

  _.isElement = function (obj) {
    return !!(obj && obj.nodeType === 1);
  }

  _.isArray = nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]';
  }

  _.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
    _['is' + name] = function (obj) {
      return toString.call(obj) === '[object ' + name + ']';
    }
  });

  if (!_.isArguments(arguments)) {
    _.isArguments = function (obj) {
      return _.has(obj, 'callee');
    }
  };

  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function (obj) {
      return typeof obj == 'function' || false;
    }
  }

  _.isFinite = function (obj) {
    return isFinite(obj) || !isNaN(parseFloat(obj));
  };

  _.isNaN = function (obj) {
    return _.isNumber(obj) && obj !== +obj; // isNaN(obj)
  }

  _.isBoolean = function (obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  _.isNull = function (obj) {
    return obj === null;
  }

  _.isUndefined = function (obj) {
    return obj === void 0;
  }

  _.has = function (obj, key) {
    return obj != null && hasOwnProperty.call(obj, key)
  }
  // Utility Functions
  _.noConflict = function () {
    root._ = previousUnderscore;
    return this;
  }

  _.identity = function (value) {
    return value;
  }

  _.constant = function (value) {
    return function () {
      return value;
    }
  }

  _.noop = function () {}

  _.property = property;

  _.propertyOf = function (obj) {
    return obj = null ? function () {} : function (key) {
      return obj[key]
    };
  }

  _.matcher = _.matches = function (attrs) {
    attrs = _.extendOwn({}, attrs);
    return function (obj) {
      return _.isMatch(obj, attrs);
    }
  }

  _.times = function (n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = cb(iteratee, context);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  _.random = function (min, max) {
    if (max == null) {
      min = 0;
      max = min;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  _.now = Date.now || function () {
    return new Date().getTime();
  };

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "`": '&#x60;'
  }

  var unescapeMap = _.invert(escapeMap);

  var createEscaper = function (map) {
    var escaper = function (match) {
      return map[match];
    }
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function (string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    }
  }

  _.escape = createEscaper(escapeMap);
  _.unescapeMap = createEscaper(unescapeMap);

  _.result = function (obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]]
      if (prop === void 0) {
        prop = fallback;
        i = length;
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  var idCounter = 0;
  _.uniqueId = function (prefix) {
    var id = ++idCounter;
    return prefix ? prefix + id : id;
  };

  _.tempateSetting = {
    evaluate: /<%([\s\S]+?)%>/,
    interpolate: /<%=([\s\S]+?)%>/,
    escape: /<%-([\s\S]+?)%>/g
  }

  var noMatch = /(.)^/;

  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  var escapeChar = function (match) {
    return '\\' + escapes[match];
  }

  _.template = function (text, setting, oldSetting) {
    if (!setting && oldSetting) setting = oldSetting;
    setting = _.defaults({}, setting, _.tempateSetting);

    var matcher = RegExp([
      (setting.escape || noMatch).source,
      (setting.interpolate || noMatch).source,
      (setting.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {

    })
    source += "';\n";
  }

  _.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  var chainResult = function (instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  _.mixin = function (obj) {
    _.each(_.functions(obj), function (name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function () {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  }

  _.mixin(_);

  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    }
  })

  _.each(['concat', 'join', 'slice'], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      return chainResult(this, method.apply(this._wrapped, arguments))
    }
  })

  _.prototype.value = function () {
    return this._wrapped;
  };

  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function () {
    return String(this._wrapped);
  }

  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function () {
      return _;
    });
  }
}.call(this));