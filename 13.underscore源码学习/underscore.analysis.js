//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function () {

    // Baseline setup
    // 基础定义

    // 由于underscore即支持浏览器端运行,又支持服务端运行,所以,需要判定根节点是'window'对象还是'global'对象
    // 值得注意的是, 如果当前系统中存在了self对象,且满足一定条件,那么他表示的就是浏览器端的根对象(全局对象)
    // 这个可以通过在chrome控制台敲击self证实
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    // 如果之前系统存在了_, 那么保存, 而不是粗暴的替换
    var previousUnderscore = root._;

    // 保存常用原型的引用, 避免对象属性的查找开销
    var ArrayProto = Array.prototype, ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    // 保存常用方法的引用, 避免属性查找的性能开销
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // are declared here.
    // 保存一些ES5常用的原生方法引用
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;

    // Ctor: 亦即constructor的缩写，这个空的构造函数将在之后广泛用于对象创建
    var Ctor = function () {
    };

    // Create a safe reference to the Underscore object for use below.
    // 创建一个underscore的对象引用, 保证不重复创建
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // 将underscore对象挂载到合适的位置
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.8.3';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    /** 优化回调(特指函数中传入的回调)
     *
     * @param func 待优化回调函数
     * @param context 执行上下文
     * @param argCount 参数个数
     * @returns {*}
     */
    var optimizeCb = function (func, context, argCount) {
        // void 0 会返回纯正的undefined,这样做避免undefined已经被污染带来的判定失效
        // 一定要保证回调的执行上下文存在
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            // 回调参数为1时, 即迭代过程中,我们只需要值
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            // 2个参数的情况几乎不存在, 所以省却判断
            // 3个参数(值,索引,被迭代集合对象)
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            // 4个参数(累加器(比如reducer需要的), 值, 索引, 被迭代集合对象)
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    var builtinIteratee;

    // An internal function to generate callbacks that can be applied to each
    // element in a collection, returning the desired result — either `identity`,
    // an arbitrary callback, a property matcher, or a property accessor.
    /**
     * 为迭代过程中的元素生产一个回调函数, 该回调函数能够应用到集合中的每个元素
     * @param value
     * @param context
     * @param argCount
     * @example
     * 在_.map函数中:
     * _.map = _.collect = function (obj, iteratee, context) {
     *       iteratee = cb(iteratee, context);
     *       // 同样,根据obj是对象还是数组分别考虑
     *       var keys = !isArrayLike(obj) && _.keys(obj),
     *           length = (keys || obj).length,
     *           results = Array(length); // 定长初始化数组
     *       for (var index = 0; index < length; index++) {
     *           var currentKey = keys ? keys[index] : index;
     *           results[index] = iteratee(obj[currentKey], currentKey, obj);
     *       }
     *       return results;
     *   };
     * @returns {*}
     */
    var cb = function (value, context, argCount) {
        // 是否用默认的迭代器
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        // 如果value不存在, 则回调只是一个返回自身的函数
        if (value == null) return _.identity;

        // 如果value是一个回调函数, 则需要优化回调
        // ex.
        // var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);

        // 如果value是个对象, 则返回一个matcher进行对象匹配
        // ex.
        // _.find(obj, {x: 2})
        if (_.isObject(value)) return _.matcher(value);

        // 否则, 如果value只是一个字面量, 则把value看做是属性名称, 返回一个对应的属性获得函数
        return _.property(value);
    };

    // External wrapper for our callback generator. Users may customize
    // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
    // This abstraction hides the internal-only argCount argument.
    /**
     * 内置的迭代回调
     * @param value
     * @param context
     */
    _.iteratee = builtinIteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    /**
     * 类ES6 rest参数的实现,使某个函数具备支持rest参数的能力
     * @param func 需要rest参数的函数
     * @param startIndex 从哪里开始标识rest参数, 如果不传递, 默认最后一个参数为rest参数
     * @returns {Function} 返回一个具有rest参数的函数
     */
    var restArgs = function (func, startIndex) {
        // rest参数从哪里开始,如果没有,则默认视函数最后一个参数为rest参数
        // 注意, 函数对象的length属性, 揭示了函数的参数个数
        /*
         ex: function add(a,b) {return a+b;}
         console.log(add.length;) // 2
         */r
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        // 返回一个支持rest参数的函数
        return function () {
            // 校正参数, 以免出现负值情况
            var length = Math.max(arguments.length - startIndex, 0);
            // 为rest参数开辟数组存放
            var rest = Array(length);
            // 假设参数从2个开始: func(a,b,*rest)
            // 调用: func(1,2,3,4,5); 实际的调用是:func.call(this, 1,2, [3,4,5]);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            // 根据rest参数不同, 分情况调用函数, 需要注意的是, rest参数总是最后一个参数, 否则会有歧义
            switch (startIndex) {
                case 0:
                    // call的参数一个个传
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
                case 2:
                    return func.call(this, arguments[0], arguments[1], rest);
            }
            // 如果不是上面三种情况, 而是更通用的(应该是作者写着写着发现这个switch case可能越写越长, 就用了apply)
            var args = Array(startIndex + 1);
            // 先拿到前面参数
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            // 拼接上剩余参数
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    /**
     * 创建一个对象，该对象继承自prototype
     * 并且保证该对象在其原型上挂载属性不会影响所继承的prototype
     * @param {object} prototype
     */
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        // 如果存在原生的创建方法（Object.create），则用原生的进行创建
        if (nativeCreate) return nativeCreate(prototype);
        // 利用Ctor这个空函数，临时设置对象原型
        Ctor.prototype = prototype;
        // 创建对象，result.__proto__ === prototype
        var result = new Ctor;
        // 还原Ctor原型
        Ctor.prototype = null;
        return result;
    };

    // property('name')(Tiger), 获得对象属性
    // 这体现了函数式编程的灵活
    // var nameProperty = property('name'), 就获得了一个专门用于采集对象name属性的函数
    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // 最大数组长度, 避免IOS 8出现的bug
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    // 设置一个常用方法,获得对象长度
    // 如果在OO的开发方式中, 我们获得对象长度是通过对象属性: obj.length
    // 而在FP中, 对象也只是数据的一个表现形式, 他只是被函数所加工: getLength(obj)
    var getLength = property('length');

    /**
     * 判断集合是否是近似数组的, 方便集合迭代过程中的循环判定
     * @param collection 集合对象
     */
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // 集合部分的函数

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    //
    /**
     * each方法将ES5的forEach换为了函数式表达
     * @param obj 待迭代集合
     * @param iteratee 迭代过程中每个被迭代元素的回调函数
     * @param context 上下文
     * @example
     * // 数组迭代
     * _.each([1, 2, 3], alert);
     * // 对象迭代
     * _.each({one: 1, two: 2, three: 3}, alert);
     */
    _.each = _.forEach = function (obj, iteratee, context) {
        // 首先要优化回调过程
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        // 区分数组和对象的迭代过程
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                // 数组的迭代回调传入三个参数(迭代值, 迭代索引, 迭代对象)
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                // 对象的迭代回调传入三个参数(迭代值, 迭代的key, 迭代对象)
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        // 返回对象自身, 以便进行链式构造
        return obj;
    };

    // Return the results of applying the iteratee to each element.
    /**
     * map,collect函数将ES5的数组的map方法换为了函数是表达
     * @param obj 对象
     * @param iteratee 迭代回调
     * @param context 执行上下文
     * @example
     * _.map([1, 2, 3], function(num){ return num * 3; });
     */
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        // 同样,根据obj是对象还是数组分别考虑
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length); // 定长初始化数组
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Create a reducing function iterating left or right.
    /**
     * reduce函数的工厂函数, 用于生成一个reducer, 通过参数决定reduce的方向
     * @param dir 方向 left or right
     * @returns {function}
     */
    var createReduce = function (dir) {
        // Wrap code that reassigns argument variables in a separate function than
        // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
        var reducer = function (obj, iteratee, memo, initial) {
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            // 如果reduce没有初始化memo, 则默认为首个元素(从左开始则为第一个元素,从右则为最后一个元素)
            if (!initial) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                // 执行reduce回调,刷新当前值
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        };

        return function (obj, iteratee, memo, context) {
            // 如果参数正常,则代表已经初始化了memo
            var initial = arguments.length >= 3;
            // 所有的传入回调都要通过optimizeCb进行优化,
            // reducer因为引入了累加器,所以优化函数的第三个参数传入了4,
            // 这样, 新的迭代回调第一个参数就是当前的累加结果:
            // _.reduce([1,2,3],function(prev,current){})
            return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
        };
    };

    // 分别定义向左及向右的reduce函数
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    /**
     * 向左reduce
     * @alias _.foldl
     * @alias _.inject
     * @example
     * var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);
     */
    _.reduce = _.foldl = _.inject = createReduce(1);

    // The right-associative version of reduce, also known as `foldr`.
    /**
     * 向右reducer
     * @alias _.foldr
     * @example
     * // 从右边开始, 扁平化一个序列
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     */
    _.reduceRight = _.foldr = createReduce(-1);

    // Return the first value which passes a truth test. Aliased as `detect`.
    /**
     * 根据真值检测函数, 在集合内搜索
     * @param obj 待查询对象,
     * @param predicate 真值检测函数
     * @param context 执行上下文
     * @alias _.detect
     * @example
     * // 获得集合中的偶数
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
     */
    _.find = _.detect = function (obj, predicate, context) {
        // 如果是对象,则根据key查找;如果是数组,则根据下标查找
        var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
        var key = keyFinder(obj, predicate, context);
        if (key !== void 0 && key !== -1) return obj[key];
    };

    /**
     * 根据真值检测函数, 过滤对象
     * 如果真值检测通过, 元素被保留
     * @param obj 待过滤对象
     * @param predicate 真值检测函数
     * @param context 执行上下文
     * @alias _.select
     * @example
     * // 保留偶数
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
     */
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        // 保证真值检测函数有效
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    /**
     * filter的反运算,
     * 如果真值检测通过, 元素被丢弃
     * @param obj 待过滤对象
     * @param predicate 真值检测函数
     * @param context 执行上下文
     * @example
     * // 保留奇数
     * var odds = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
     */
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    /**
     * 迭代对象里面的每个元素, 只有每个元素都通过真值检测, 才返回true
     * @param obj 待迭代对象
     * @param predicate 真值检测函数
     * @param context 执行上下文
     * @alias _.all
     * @example
     * _.every([true, 1, null, 'yes'], _.identity);
     */
    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            // 一旦有元素没有通过真值检测, 立即返回false
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    /**
     * 迭代一个对象所有元素, 如果任意一个元素通过真值检测, 则返回true
     * @param obj 迭代对象
     * @param predicate 真值检测函数
     * @param context 执行上下文
     * @alias _.any
     * @example
     * _.some([null, 0, 'yes', false]);
     */
    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    /**
     * 检测一个数组或者对象是否包含一个指定的元素
     * @param obj 待检测对象
     * @param item 指定元素
     * @param fromIndex 从哪个位置开始查找
     * @param guard ?
     * @alias _.includes
     * @alias _.include
     * @example
     *_.contains([1, 2, 3], 3);
     * // => true
     */
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        // 如果不是数组, 则根据值查找
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    /**
     * 迭代集合, 调用每个元素的属性方法method
     * @param obj 迭代对象
     * @param method 待调用方法
     * @param args 调用所需参数,这些参数每次都会传入method中
     * @example
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     */
        // 首先通过restArgs包裹invoke, 使得_.invoke支持rest参数
    _.invoke = restArgs(function (obj, method, args) {
        // 通过闭包避免每次重复调用_.isFunction(method)
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            // 如果对象上不存在方法, 则返回null
            return func == null ? func : func.apply(value, args);
        });
    });

    /**
     * 获得对象集合中对应属性的对应值(摘出来)
     * @param obj 传入集合
     * @param key 需要摘出来的属性(如果传入的集合中的各个元素是数组, 则key代表下标)
     * @example
     * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     * _.pluck(stooges, 'name');
     * // => ["moe", "larry", "curly"]
     * _.pluck([[1,2,3],[4,5,7],[8,9,10]], 2);
     * // => [3,7,10]
     */
    _.pluck = function (obj, key) {
        // 迭代集合, 每个迭代元素返回其对应属性的对应值
        return _.map(obj, _.property(key));
    };

    /**
     * 类似sql中where查询条件, 对于一个对象集合, 返回满足where条件的对象
     * @param obj 待迭代参数
     * @param attrs where条件对象
     * @example
     * _.where(listOfPlays, {author: "Shakespeare", year: 1611});
     * // => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
     * // {title: "The Tempest", author: "Shakespeare", year: 1611}]
     */
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    /**
     * 迭代对象集合, 获得第一个满足条件的对象
     * @param obj 对象集合
     * @param attrs where条件对象
     * _.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
     // => {year: 1918, newsroom: "The New York Times",
     //     reason: "For its public service in publishing in full so many official reports,
     //     documents and speeches by European statesmen relating to the progress and
     //     conduct of the war."}
     */
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    /**
     * 获得集合中的最大值
     * @param obj 对象集合
     * @param iteratee 如果传递了iteratee, 则以iteratee作为最大值的计算依据
     * @param context 执行上下文
     * @example
     * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     * _.max(stooges, function(stooge){ return stooge.age; });
     * // => {name: 'curly', age: 60};
     * @returns {number}
     */
    _.max = function (obj, iteratee, context) {
        // 默认返回-Infinity
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            // 如果没有传递iteratee, 则按值进行比较
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value > result) {
                    result = value;
                }
            }
        } else {
            // 否则, 以iteratee为最大值依据, 每次传入当前迭代值给iteratee, 算出最大值
            iteratee = cb(iteratee, context);
            _.each(obj, function (v, index, list) {
                computed = iteratee(v, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    /**
     * 获得集合中的最小值
     * @param obj 对象集合
     * @param iteratee 最小值依据
     * @param context 执行上下文
     * @returns {Number} 默认返回Infinity
     */
    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (v, index, list) {
                computed = iteratee(v, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    /**
     * 返回一个随机乱序的集合副本, 显然, 该函数不是一个纯函数
     * @param obj 集合对象
     * @example
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    _.shuffle = function (obj) {
        return _.sample(obj, Infinity);
    };

    // Sample **n** random values from a collection using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    /**
     * 从集合中产生一个随机样本。
     * 采用了[Fisher-Yates shuffle算法(洗牌算法)](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle)
     * 洗牌算法用来对序列随机排序
     * @param obj 对象
     * @param n 需要返回的随机元素个数, 否则将返回一个单一的随机项。
     * @param guard
     * @example
     * _.sample([1, 2, 3, 4, 5, 6], 3);
     // => [1, 6, 2]
     _.sample([1, 2, 3, 4, 5, 6]);
     // => 4
     * @returns {*}
     */
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        // 如果是对象,乱序key的排列
        var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
        var length = getLength(sample);
        // 校正参数n,使得0<=n<length
        n = Math.max(Math.min(n, length), 0);
        var last = length - 1;
        // 开始洗牌算法, 洗出来n个就停止了
        for (var index = 0; index < n; index++) {
            // 从[index, last]获得一个随机位置
            var rand = _.random(index, last);
            // 当前值
            var temp = sample[index];
            // 交换当前值与随机位置上的值
            sample[index] = sample[rand];
            sample[rand] = temp;
            // 此时,排序后的第一个数据sample[0]已经确定
        }
        return sample.slice(0, n);
    };

    // Sort the object's values by a criterion produced by an iteratee.
    /**
     * 类似Sql中的sort关键字, 根据某个key进行排序
     * @param obj 集合
     * @param iteratee 排序依据
     * @param context 执行上下文
     * @example
     * _.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
     * // => [5, 4, 6, 3, 1, 2]
     */
    _.sortBy = function (obj, iteratee, context) {
        var index = 0;
        iteratee = cb(iteratee, context);
        // 先通过map生成新的对象集合,该对象提供了通过iteratee计算后的值, 方便排序
        // [{value:1,index:0,criteria: sin(1)}, ...]
        // 再排序.sort
        // 最后再通过pluck把值摘出来
        return _.pluck(_.map(obj, function (value, key, list) {
            return {
                value: value,
                index: index++,
                criteria: iteratee(value, key, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    /**
     * group函数将在涉及到分组的地方使用
     * @param behavior 获得组别之后的行为
     * @param partition 是否进行划分
     * @returns {Function}
     * @example
     */
    var group = function (behavior, partition) {
        // 返回一个分组函数
        return function (obj, iteratee, context) {
            // 分组结果初始化
            // 如果是进行划分(二分)的话, 则结果分为两个组
            var result = partition ? [[], []] : {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                // 计算得到分组组别key, 如果是划分的话, key就是一个bool
                var key = iteratee(value, index, obj);
                // 获得组别后, 执行定义的行为
                behavior(result, value, key);
            });
            return result;
        };
    };

    /**
     * 类似sql中的group by关键字
     * @param obj 待分组集合
     * @param iteratee 分组依据, 如果是函数, 则需要根据函数计算组别; 如果是字符串,
     * @param context 执行上下文
     * @example
     * _.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
     * // => {1: [1.3], 2: [2.1, 2.4]}

     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => {3: ["one", "two"], 5: ["three"]}
     * @type {Function}
     */
    _.groupBy = group(function (result, value, key) {
        // groupBy的分组行为为:
        // 如果分组结果中存在了key(存在了分组), 满足该分组条件的value会追加到该分组中
        // 否则新创建一个分组, 并将value放入当中
        if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    /**
     * 根据XX索引集合对象
     * @param list 集合对象
     * @param iteratee 索引依据
     * @example
     * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     * _.indexBy(stooges, 'age');
     * => {
            "40": {name: 'moe', age: 40},
            "50": {name: 'larry', age: 50},
            "60": {name: 'curly', age: 60}
           }
     * @type {Function}
     */
    _.indexBy = group(function (result, value, key) {
        // 获得分组后的行为, 每个分组对应一个对象
        result[key] = value;
    });

    /**
     * 计算各分组中的元素数
     * @param list 集合对象
     * @param iteratee 分组依据
     * @type {Function}
     * @example:
     * _.countBy([1, 2, 3, 4, 5], function(num) {
          return num % 2 == 0 ? 'even': 'odd';
       });
     // => {odd: 3, even: 2}
     */
    _.countBy = group(function (result, value, key) {
        // 获得分组后的行为, 分组保存组内元素个数
        if (_.has(result, key)) result[key]++; else result[key] = 1;
    });

    // 重要正则
    // [^\ud800-\udfff]: 表示不包含代理对代码点的所有字符
    // [\ud800-\udbff][\udc00-\udfff]: 表示合法的代理对的所有字符
    // [\ud800-\udfff]: 表示代理对的代码点（本身不是合法的Unicode字符）
    // 参考文献:
    // [字符编码的那些事](http://licstar.net/archives/tag/utf-8)
    // [知乎关于underscore这个正则的提问](https://www.zhihu.com/question/38324041)
    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    // Safely create a real, live array from anything iterable.
    /**
     * 将对象转换为数组
     * @param obj
     * @returns {*}
     */
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        // 尤其注意的是string的转换
        if (_.isString(obj)) {
            // Keep surrogate pair characters together
            // match每一个字符到数组中, 通过reStrSymbol保证了:
            // 1. 不含代理对代码点的所有字符
            // 2. 合法代理对的所有字符
            // 3. 代理对代码点的字符
            // 都能match的数组
            return obj.match(reStrSymbol);
        }
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    /**
     * 返回集合长度, 如果是对象, 返回key的数目, 如果是数组, 返回数组长度
     * @param obj 集合
     * @returns {number}
     */
    _.size = function (obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    /**
     * 划分函数, 讲一个集合对象划分为两个数组, 划分依据来源于真值预测
     * @param array 真值预测
     * @param predicate 真值预测函数
     * @example
     * _.partition([0, 1, 2, 3, 4, 5], isOdd);
     * // => [[1, 3, 5], [0, 2, 4]]
     * @type {Function}
     */
    _.partition = group(function (result, value, pass) {
        // 分组后的行为,
        result[pass ? 0 : 1].push(value);
    }, true);

    // Array Functions
    // ---------------

    /**
     * 获得数组的第一个元素,
     * @param array 数组
     * @param n 如果传递了参数n, 则返回前n个元素
     * @alias _.head
     * @alias _.take
     * @example
     * _.first([5, 4, 3, 2, 1]);
     * => 5
     */
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    /**
     * 返回除了最后一个元素的数组所有元素
     * @param array
     * @param n 如果传递了参数n, 则返回除了最后n元素的以外的所有数组元素
     * @param guard
     * @example
     * _.initial([5, 4, 3, 2, 1]);
     * => [5, 4, 3, 2]
     */
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    /**
     * 返回数组最后的元素
     * @param array 数组
     * @param n 如果传递了参数n, 则返回最后n个元素
     * @param guard
     * @example
     * _.last([5, 4, 3, 2, 1]);
     * => 1
     */
    _.last = function (array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    /**
     * 返回数组除了第一个元素外的所有元素
     * @param array 数组
     * @param n 如果传递了参数n, 返回前n个元素以外的所有元素
     * @param guard
     * @alias _.tail
     * @alias _.drop
     * @example
     * _.rest([5, 4, 3, 2, 1]);
     * => [4, 3, 2, 1]
     */
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    /**
     * 返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
     * @param array
     * @example
     * _.compact([0, 1, false, 2, '', 3]);
     * => [1, 2, 3]
     */
    _.compact = function (array) {
        // Boolean(1) => true, Boolean(0) => false
        return _.filter(array, Boolean);
    };

    /**
     * 递归展平集合
     * @param input 输入
     * @param shallow 如果shallow为true，数组将只减少一维的嵌套。(浅展平)
     * @param strict 严格模式下, input必须为数组
     * @param output 输出数组
     * @example

     * @returns {*|Array}
     */
    var flatten = function (input, shallow, strict, output) {
        output = output || [];
        var idx = output.length; // 输出数组的下标
        for (var i = 0, length = getLength(input); i < length; i++) {
            // 获得元素值
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                // Flatten current level of array or arguments object.
                if (shallow) {
                    // 如果不是深度展开
                    // 只是从value(数组)中不断抽出元素赋值output中
                    // 例如, value=[1,[3],[4,5]]
                    // output = [....1,3,[4,5]....]
                    var j = 0, len = value.length;
                    while (j < len) output[idx++] = value[j++];
                } else {
                    // 否则需要递归展开
                    flatten(value, shallow, strict, output);
                    // 刷新下标
                    idx = output.length;
                }
            } else if (!strict) {
                // 如果不是严格模式, 则value可以不是数组
                output[idx++] = value;
            }
        }
        return output;
    };

    /**
     * 展平一个数组
     * @param array 待展开数组
     * @param shallow 是否只是浅展平,如果shallow为true，数组将只减少一维的嵌套
     * @example
     * // 深度展平(所有元素不再被数组包裹)
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     * // 浅展平(只展开一层)
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * @returns {*|Array}
     */
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    /**
     * 返回一个排除掉values的数组
     * @param array 数组
     * @param values 支持rest参数,
     * @example
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * => [2, 3, 4]
     * @type {Function}
     */
    _.without = restArgs(function (array, otherArrays) {
        return _.difference(array, otherArrays);
    });

    /**
     * 返回array去重后的副本
     * @param array 待去重数组
     * @param isSorted 数组是否排序, 如果该参数设置为true, 那么可以加快该函数的执行过程
     * @param iteratee 比较函数, 默认是 ===
     * @param context 执行上下文
     * @alias _.unique
     * @example
     * _.uniq([1, 2, 1, 3, 1, 4]);
     * // => [1, 2, 3, 4]
     * _.unique([{age:13, name:"tom"},{age:15, name:"jack"},{age:13, name:"bob"}], 'age']
     * // => [{age:13, name:"tom"}, {age:15, name: "jack"}]
     */
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        // 如果第二个参数不是bool, 则应当理解为是比较函数, 且默认是没有排序的数组
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = []; // 标识数组
        for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            // 如果排好序了, 直接通过比较操作!==
            if (isSorted) {
                // 如果已经排序, seen只需要反映最近一次见到的元素
                // !i: 第一个元素放入结果数组
                // seen !== computed 没有见过的元素放入结果数组
                if (!i || seen !== computed) result.push(value);
                // 刷新最近一次所见
                seen = computed;
            } else if (iteratee) {
                // 如果尚未排序, 且存在比较函数, 亦即不能直接通过===判断
                // 那么我们无法直接通过_.contains(result, value)判断value是否已经存在
                // 例如_.unique([{age:13, name:"tom"},{age:15, name:"jack"},{age:13, name:"bob"}], 'age']
                // 这种情况下就需要借助于seen这个辅助数组存储计算后的数组元素
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                // 否则直接通过contains进行判断
                result.push(value);
            }
        }
        return result;
    };

    /**
     * 产生数组的并集
     * @param arrays 可以传入多个数组
     * @example
     * _.union([1, 2, 3], [101, [2, 1], 10], [2,3]);
     * // => [1,2,3,101,[2,1],10]
     * @type {Function}
     */
    _.union = restArgs(function (arrays) {
        // 先将各个数组展开(浅, 严格要求数组) => [1,2,3,101,[2,1],10,2,3]
        // 再去重 => [1,2,3,101,[2,1],10]
        return _.uniq(flatten(arrays, true, true));
    });

    /**
     * 获得数组交集
     * @param array 数组
     * @example
     * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     * // => [1, 2]
     * @returns {Array}
     */
    _.intersection = function (array) {
        var result = [];
        var argsLength = arguments.length;
        // 遍历第一个数组
        for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            // 如果结果数组已经包含了该元素, 跳过此次遍历
            if (_.contains(result, item)) continue;
            var j;
            // 遍历的后面的数组, 如果后面的数组有没有包含item
            // 则该item显然就不是交集中的元素, 提前终止判断
            for (j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) break;
            }
            // 否则, 即后面的数组都包含该item, 该item就是交集元素
            if (j === argsLength) result.push(item);
        }
        return result;
    };

    /**
     * 计算数组的差, 返回所有第一个数组中存在, 而其余数组中都不存在的元素
     * @param array
     * @param rest 待排除元素, 支持rest参数
     * @example
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     * @type {Function}
     */
    _.difference = restArgs(function (array, rest) {
        // 先展开剩余数组为一个rest数组
        rest = flatten(rest, true, true);
        // 遍历array, 过滤掉array中的存在于rest数组中元素
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    });

    /**
     * 给定若干数组, 每个数组对应位置的元素提取出来放入新的分组, 最后合并这些分组
     * @param array
     * @example
     * _.unzip([['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]])
     * // => [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
     * @returns {*}
     */
    _.unzip = function (array) {
        // 原数组的长度反映了最后分的组数目
        var length = array && _.max(array, getLength).length || 0;
        // 结果数组与原数组等长
        var result = Array(length);
        //
        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    /**
     * 每个数组对应位置的值合并到一起
     * @example
     * _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
     * // => [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
     * @type {Function}
     */
    _.zip = restArgs(_.unzip);

    /**
     * 将序列转换为对象
     * @param list 序列 如果value没有传入, list中的每个元素是[key, value]形式的
     * @param values 如果value传入的话, 则list为key集合
     * @example
     * _.object(['moe', 'larry', 'curly'], [30, 40, 50]);
     * // => {moe: 30, larry: 40, curly: 50}
     * _.object([['moe', 30], ['larry', 40], ['curly', 50]]);
     * // => {moe: 30, larry: 40, curly: 50}
     * @returns {{}}
     */
    _.object = function (list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    /**
     * 位置预测函数的生成器, 用来生成findIndex和findLastIndex等位置查询函数
     * @param dir 方向
     * @returns {Function}
     */
    var createPredicateIndexFinder = function (dir) {
        /**
         * 返回的位置查询函数
         * @param array 待搜索数组
         * @param predicate 真值检测函数
         * @param context 执行上下文
         */
        return function (array, predicate, context) {
            // 保证真值检测函数有效,
            // 因为位置的判断可能通过直接量, 如:
            // _.findIndex([4, 6, 8, 12],12);
            // 也通过条件判定,如:
            // _.findIndex([4, 6, 8, 12], function(value){return value%12===0;});
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                // 只找到第一次满足条件的位置
                if (predicate(array[index], index, array)) return index;
            }
            return -1;
        };
    };

    /**
     * 从左边开始查找, 找到第一次满足条件的位置
     * @example
     * _.findIndex([4, 6, 8, 12], function(value){return value%12===0;})
     * // => 3
     * @type {Function}
     */
    _.findIndex = createPredicateIndexFinder(1);

    /**
     * 从右边开始查找, 找到第一次满足条件的位置
     * @example
     * _.findLastIndex([4, 6, 8, 12], function(value){return value%12===0;})
     * // => 3
     * @type {Function}
     */
    _.findLastIndex = createPredicateIndexFinder(-1);


    /**
     * 返回obj应当在array中的位置, 位置查找的算法使用二分查找
     * @param array 已排序数组
     * @param obj 待确定位置对象
     * @param iteratee 位置确定标准
     * @param context 执行上下文
     * @example
     * _.sortedIndex([10, 20, 30, 40, 50], 35);
     * // => 3
     * var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
     * _.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');
     * // => 1
     * @returns {number}
     */
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
        }
        return low;
    };

    /**
     * 创建一个查询某位置元素的Finder
     * @param dir 查询方向 1为从左往右, -1为从右往左
     * @param predicateFind
     * @param sortedIndex
     * @returns {Function}
     */
    var createIndexFinder = function (dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0, length = getLength(array);
            // 如果设定了查询起点, 且查询起点格式正确（数字）
            if (typeof idx == 'number') {
                // 校正查询起点
                if (dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length) {
                // 如果传递sortedIndex函数, 则先假设array为排序好的, 获得item在array中的位置
                idx = sortedIndex(array, item);
                // 验证这个假设是否正确
                return array[idx] === item ? idx : -1;
            }
            // 如果待查找item不是数字，即是NaN(JS中,NaN===NaN 为false), 需要通过predicateFind来查找
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            // 否则直接通过 === 进行查找
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) return idx;
            }
            return -1;
        };
    };

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    /**
     * 从左到右查找, 返回第一个对应元素的位置, 查不到则返回-1
     * @param array
     * @param item 待查询元素
     * @param idx 查询起点, 从哪个位置开始查找, 如果为负值, 则起点从右边开始算, 比如-1代表从最后一个元素开始
     * _.indexOf([1, 2, 3], 2);
     // => 1
     * @type {Function}
     */
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

    /**
     * 从右到左查找, 返回第一个对应元素的位置,
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * => 4
     * @type {Function}
     */
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    /**
     * 类似于python的range函数, 根据区间产生一个数组
     * @param start 区间开始
     * @param stop 区间结束
     * @param step 补偿
     * @example
     * _.range(10);
     * // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     * _.range(1, 11);
     * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     * _.range(0, 30, 5);
     * // => [0, 5, 10, 15, 20, 25]
     * _.range(0, -10, -1);
     * // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
     * _.range(0);
     * // => []
     * @returns {*}
     */
    _.range = function (start, stop, step) {
        // 校正终点
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        // 校正步长
        if (!step) {
            step = stop < start ? -1 : 1;
        }

        // 计算最终数组的长度
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    /**
     * 将一个数组划分为n个部分
     * @param array
     * @param count
     * @returns {Array}
     */
    _.chunk = function (array, count) {
        if (count == null || count < 1) return [];

        var result = [];
        var i = 0, length = array.length;
        while (i < length) {
            result.push(slice.call(array, i, i += count));
        }
        return result;
    };

    // Function (ahem) Functions
    // ------------------

    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments.
    /**
     * 决定一个如何执行一个绑定后的函数并执行,是作为构造函数?还是作为一个普通函数
     * @param sourceFunc 原函数
     * @param boundFunc 绑定后的函数
     * @param context 绑定的上下文
     * @param callingContext 调用上下文
     * @param args 参数
     * @returns {*}
     */
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
        // 如果调用上下文不是绑定后的函数, 则绑定后的函数执行体为 sourceFunc.apply(context, args);
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
    };

    /**
     * 绑定函数 function 到上下文context上
     * @param func 待绑定函数
     * @param context 绑定上下文
     * @param args 绑定参数,支持rest参数
     * @example
     * var func = function(greeting){ return greeting + ': ' + this.name };
     * func = _.bind(func, {name: 'moe'});
     * func('hi');
     => 'hi: moe'
     * @type {Function}
     */
    _.bind = restArgs(function (func, context, args) {
        // 保证待绑定对象是一个函数
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        // 返回一个绑定后的,支持reset参数的函数, callArgs为调用时的参数, 例如例子中的'hi'
        var bound = restArgs(function (callArgs) {
            // 执行该绑定函数
            // 原函数: func
            // 绑定后的函数: bound
            // 绑定时的上下文: context
            // 执行时的上下文: this, 此时this!=bound
            // 执行参数: bind时绑定的参数args 加上 调用绑定函数的参数 callArgs
            return executeBound(func, bound, context, this, args.concat(callArgs));
        });
        return bound;
    });

    /**
     * 实现函数的"部分应用",  借此可以创建新的函数, 延迟函数执行
     * 上下文this需要动态决定,
     * 为了使用更加方便, 提供placeholder机制, 看下面的例子
     * @param func
     * @param boundArgs 新函数绑定了的参数
     * @example
     * var subtract = function(a, b) { return b - a; };
     * sub5 = _.partial(subtract, 5);
     * sub5(20);
     * // => 15

     * // 通过使用了一个placeholder(默认被理解的占位符为_), 我们这次先赋值了b, 暂缓了对a的赋值
     * subFrom20 = _.partial(subtract, _, 20);
     * subFrom20(5);
     * // => 15
     * @type {Function}
     */
    _.partial = restArgs(function (func, boundArgs) {
        var placeholder = _.partial.placeholder;
        // 返回一个partial后的新函数
        var bound = function () {
            // position用来标识当前已赋值的arguments个数, boundArgs: [_,20]
            var position = 0, length = boundArgs.length;
            // 初始化新函数执行的参数
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                // 如果遇到占位符, 赋值新函数的对应占位符位置的参数, 之后刷新位置, 否则赋值绑定时对应位置的参数
                args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
            }
            // args[0] = 5, args[1] = 20; position = 1
            // 如果当前函数还有参数(亦即赋值了的arguments个数小于arguments长度), 全部灌入args
            while (position < arguments.length) args.push(arguments[position++]);
            // 执行绑定函数的时候, 动态决定上下文(apply的上下文和当前调用上下文一致)
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    });

    // 默认被理解的占位符为_, 允许自定义
    _.partial.placeholder = _;

    /**
     * 永久绑定对象方法的this到指定的object上, 避免之后产生的一些误会
     * @param obj 待绑定对象
     * @keys rest参数, 绑定对象的方法key
     * @example
     * var buttonView = {
     *  label  : 'underscore',
     *  onClick: function(){ alert('clicked: ' + this.label); },
     *  onHover: function(){ console.log('hovering: ' + this.label); }
     *   };
     * func = buttonView.onClick;
     * // func调用时, this指向了window
     * func(); // clicked: undefined
     * _.bindAll(buttonView, 'onClick', 'onHover');
     * func2 = buttonView.onClick;
     * func2(); // clicked: underscore
     * @type {Function}
     */
    _.bindAll = restArgs(function (obj, keys) {
        // 展开方法名
        keys = flatten(keys, false, false);
        var index = keys.length;
        if (index < 1) throw new Error('bindAll must be passed function names');
        // 将各个方法中的上下文对象(this)绑定到obj上
        while (index--) {
            var key = keys[index];
            obj[key] = _.bind(obj[key], obj);
        }
    });

    /**
     * 返回一个带缓存的记忆函数
     * @param func
     * @param hasher 如果传递了hash函数, 就能手动为缓存设定key
     * @example
     * var fibonacci = _.memoize(function(n) {
     *      return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
     * });
     * fibonacci(5);
     * console.log(fibonacci.cache);
     * // {
     * //   0: 0,
     * //   1: 1,
     * //   2: 2,
     * //   3: 2,
     * //   4: 3,
     * //   5: 5
     * // }
     * @returns {memoize}
     */
    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            // 执行记忆函数的时候, 先获得缓存
            var cache = memoize.cache;
            // 获得缓存地址
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            // 如果缓存没有命中, 则需要调用函数执行
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            // 否则直接返回缓存
            return cache[address];
        };
        // 初始化记忆函数的缓存
        memoize.cache = {};
        return memoize;
    };

    /**
     * 延迟一个函数的执行，我们可以设定在多少毫秒之后才执行这个函数
     * @param func 待延迟执行的函数
     * @param wait 待延迟的毫秒数
     * @param args 函数所需要的参数
     * @example
     * var log = _.bind(console.log, console);
     * _.delay(log, 1000, "show after 1 sec");
     * // => 'show after 1 sec' //1s之后打印该字符串
     */
    _.delay = restArgs(function (func, wait, args) {
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    });

    /**
     * 推迟一个函数执行（约1s后）
     * @param 待推迟函数
     * @param 参数
     * @example
     * var log = _.bind(console.log, console);
     * _.defer(log, "show after 1 sec");
     * // => 'show after 1 sec' // 这个显示过程被推迟
     *
     */
    // 观察占位符，第一个参数（待延迟执行的函数被占位），1s后才执行该函数
    // _.defer(log, 'show after 1 secs.')的含义就相当于_.delay(log, 1000, "show after 1 secs");
    _.defer = _.partial(_.delay, _, 1);

    /**
     * 返回一个节流函数，该函数的执行频率会被严格限制，
     * @param func
     * @param wait 等待时间
     * @param options 一些配置
    */
    _.throttle = function (func, wait, options) {
        // 本质上还是通过setTimeout()方法来实现间隔调用的
        // timeout标识最近一次被追踪的调用
        // context和args缓存func执行时需要的上下文，result缓存func执行的result
        var timeout, context, args, result;
        // 最近一次func被调用的时间点
        var previous = 0;
        if (!options) options = {};

        // 创建一个延后执行的函数包裹住func的执行过程， 使得func能够在
        var later = function () {
            // 执行时，刷新最近一次调用时间
            previous = options.leading === false ? 0 : _.now();
            // 清空定时器
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        // 返回一个throttled的函数
        var throttled = function () {
            // ----- 节流函数开始执行----
            // 我们尝试调用func时，会首先记录当前时间戳
            var now = _.now();
            // 是否是第一次调用
            if (!previous && options.leading === false) previous = now;
            // func还要等待多久才能被调用 =  预设的最小等待期-（当前时间-上一次调用的时间）
            // 显然，如果第一次调用，且未设置options.leading = false，那么remaing=0，func会被立即执行
            var remaining = wait - (now - previous);
            // 记录之后执行时需要的上下文和参数
            context = this;
            args = arguments;

            // 如果计算后能被立即执行
            if (remaining <= 0 || remaining > wait) {
                // 清除之前的“最新调用”
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                // 刷新最近一次func调用的时间点
                previous = now;
                // 执行func调用
                result = func.apply(context, args);
                // 如果timeout被清空了，
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                // 如果设置了trailing edge，那么暂缓此次调用尝试的执行
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        // 可以取消函数的节流化
        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    /**
     * throttle函数的防反跳版本
     * 从下面的debounce实现我们可以看到，
     * 不同于throttle，debounce不再计算remain时间，
     * 其提供的__immediate__参数类似于throttle中的对于leading-edge和trailing-edge的控制：
     *
     * - immediate === true，开启leading-edge，当可以执行时立即执行
     * - immediate === false（默认）开启trailing-edge，当可以执行时也必须延后至少wait个时间才能执行。
     *
     * 因此，debounce后的func要么立即获得响应，要么延迟一段时间才响应，
     * @param {Function} func 需要防止反跳的函数
     * @param {Number} wait 等待时间
     * @param {Boolean} immediate 是否允许立即执行，如果设置为true，那么如果之前的调用都执行完毕，本次调用可以立即执行
     *
     */
    _.debounce = function (func, wait, immediate) {
        var timeout, result;

        var later = function (context, args) {
            timeout = null;
            if (args) result = func.apply(context, args);
        };

        var debounced = restArgs(function (args) {
            // 一旦存在timeout， 意味之前尝试调用过func
            // 由于debounce只认最新的一次调用， 所以之前等待执行的func都会被终止
            if (timeout) clearTimeout(timeout);
            // 如果允许新的调用尝试立即执行，
            if (immediate) {
                // 如果之前尚没有调用尝试，那么此次调用可以立马执行，否则一定得等待之前的执行完毕
                var callNow = !timeout;
                // 刷新timeout
                timeout = setTimeout(later, wait);
                // 如果能被立即执行，立即执行
                if (callNow) result = func.apply(this, args);
            } else {
                // 否则，这次尝试调用会延时wait个时间
                timeout = _.delay(later, wait, this, args);
            }

            return result;
        });

        debounced.cancel = function () {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    /**
     * 函数包装器，将func函数进行包装， 是func的执行前后能融入更多业务逻辑
     * func就类似于wrapper依赖的一个模块
     * @param {Function} func 待包装函数
     * @param {Function} wrapper 包装器函数
     * @example
     * var func = function() {
     *     console.log("func is executing");
     * }
     *
     * var wrapped = _.wrap(func, function(func){
     *     console.log("before func executing");
     *     func();
     *     console.log("afert func executing");
     * });
     *
     * wrapped();
     *
     */
    _.wrap = function (func, wrapper) {
        // 将func传递给wrapper
        return _.partial(wrapper, func);
    };

    /**
     * 返回一个相反的真值检测
     * @param {Function} predicate 真值检测函数
     * @returns {Function}
     */
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    /**
     * 返回函数序列的组合，
     * 执行组合的时候，不断消耗当中的函数，并将函数的当做参数交给下一个函数
     * 如果我们传入的序列为func1，func2，func3
     * 那么被消耗的序列为func3，func2，func1
     * @example
     * var hello = function() {
     *     return 'hello';
     * }

     * var world = function(hello) {
     *  return hello+' world';
     * }

     * var print = function(str) {
     *     console.log(str);
     * }

     * var helloworld = _.compose(print, world, hello);
     * helloworld();
     * // => 'hello world'
     */
    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    /**
     * 返回一个after函数，该函数被调用times次后，每次调用都会执行回调函数func
     * @param {Int} times 调用次数
     * @param {Function} func 回调函数
     * @return {Function}
     * @example
     * var after3 = _.after(3,function(){console.log("callback executing!")});
     * after3();
     * after3();
     * after3(); //=> "callback executing";
     * after3(); //=> "callback executing";
     */
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    /**
     * 返回一个before函数，该函数在被调用times次之前，每次调用都会执行一个回调func
     * times 次后，before函数的执行结果不再变化
     * @param {Int} times 调用次数
     * @param {Function} func 回调函数
     * @return {Function}
     * @example
     * var n = 3;
     * var before3 = _.before(3,function(){return --n;});
     * before3(); //=> 3
     * before3(); //=> 2;
     * before3(); //=> 2;
     * before3(); //=> 2;
     */
    _.before = function (times, func) {
        // memo暂存最近一次的调用结果，当调用次数达到times次后，memo不再改变
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    };

    /**
     * 保证一个函数只执行一次
     * 非常适合做初始化函数的包装
     * 以往我们可能要进行flag大法
     * var initialized = false;
     * var init = function() {
     *     if(initialized) return;
     *     console.log("initializing");
     * }
     * @param {Function} func 待包装函数
     * @return {Function}
     * var init = function() {
     *     console.log("initializing!");
     * }
     * var initOnce = _.once(init);
     * initOnce();
     * initOnce();
     * //=> "initializing";
     */
    _.once = _.partial(_.before, 2);

    /**
     * 包装函数, 使得其具有接受rest参数的能力
     * @param {Function} func 待包装函数
     */
    _.restArgs = restArgs;

    // 为对象（Object）定义函数
    // ----------------
    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    // 判断是否存在ie9以下存在的的属性不可枚举的bug
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    // 该bug下不可被 for .. in 枚举的属性
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    /**
     * 收集对象obj中所有不能被枚举的key
     * @param {Object} obj
     * @param {Array} keys
     */
    var collectNonEnumProps = function (obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        // 通过对象构造函数获得对象的原型
        var constructor = obj.constructor;
        // 如果构造函数合法，且具有prototype属性，那么prototype指向的原型就是该obj的原型
        // 默认obj的原型为Object.prototype
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

        // 如果对象有constructors属性，且当前的属性集合不存在构造函数这一属性
        var prop = 'constructor';
        // 需要将constructor属性添加到属性集合中
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        // 将不可枚举的属性也添加到属性集合中
        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            // 注意，添加的属性只能是自有属性 （obj[prop] !== proto[prop]）
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    };

     /**
      * 获得对象的所有属性（自有属性，不包含那些也存在与原型链上的属性），类似于ES5中的Obejct.keys()
      * @param {Object} obj
      * @example
      * _.keys({one: 1, two: 2, three: 3});
      * // => ["one", "two", "three"]
      */
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        // 如果原生的Object.keys方法存在的话，
        // 直接调用Object.keys来获得自有属性
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        // 通过_.has,剔除掉非自有属性
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        // 如果存在枚举bug，需要校正最后的属性集合
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

     /**
      * 返回obj的所有属性
      * @param {Object} obj
      * @return {Array}
      * @example
      * function Stooge(name) {
      *     this.name = name;
      * }
      * Stooge.prototype.silly = true;
      * _.allKeys(new Stooge("Moe"));
      * // => ["name", "silly"]
      */
    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    /**
     * 获得一个对象的所有value
     * @param obj 对象
     * @returns {Array} 值序列
     * @example
     * _.values({one: 1, two: 2, three: 3});
     * // => [1, 2, 3]
     */
    _.values = function (obj) {
        // 很简单，遍历key集合，取到对应的value
        var keys = _.keys(obj);
        var length = keys.length;
        // 定长初始化,提前分配内存空间
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // Returns the results of applying the iteratee to each element of the object.
    // In contrast to _.map it returns an object.
    /**
     * map对象中的各个key, 返回一个新的新的对象
     * @param {Object} obj
     * @param {Function} iteratee
     * @param {Object} context
     * @example
     * var student1 = {
     *     name: "wxj",
     *     age: 13
     * };
     *
     * student2 = _.map(student1, function(value, key, obj){
     *     if (key === 'age')
     *         return value*2;
     *     return value;
     * });
     * // => student2: {name:"wxj", age: 26}
     */
    _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {};
        for (var index = 0; index < length; index++) {
            var currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    /**
     * 将一个对象转换为键值对[k,v]序列
     * @param {Object} obj
     * var student = {name:'wxj', age:13};
     * var pairs = _.pairs(student);
     * // => [['name','wxj'], ['age',13]]
     */
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    /**
     * 将obj的键值对换, k<-->v
     * @param {Object} obj
     * @example
     * var obj = {name: 'wxj', age:13};
     * var newObj = _.invert(obj);
     * // => {wxj:name, 13:'age'}
     */
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    /**
     * 获得对象的方法列表，该列表保存的是方法名，而不是引用
     * 该列表根据字典序进行了排序
     * @param {Object} obj
     * @alias _.methods
     * @return {Array}
     * @example
     * var obj = {
     *     say: function() {
     *         console.log("hello");
     *     },
     *     run: function() {
     *         console.log("running");
     *     }
     * };
     * var funcs = _.functions(obj);
     * // funcs: ["run","say"];
     */
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    /**
     * 创建分配器函数（Assigner）, 分配属性到某个对象
     * @param {Function} keysFunc 获得待分配的keys的方法
     * @param {Boolean} defaults 默认为false，相同属性的值会被覆盖
     * 如果设置为true， 则只会为obj分配其未定义的属性
     */
    var createAssigner = function (keysFunc, defaults) {
        return function (obj) {
            // 参数的长度反映了传入对象的个数
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            if (length < 2 || obj == null) return obj;
            // 遍历每个对象，从中不断获得属性，赋给obj
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    // 如果不是defaults模式，则会覆盖原来key的value
                    // 如果是defaults模式，则只会设置原来为undefined的属性
                    if (!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    /**
     * 扩展一个对象，它将继承传入的各个对象的属性(包括原型链上非自身的属性)
     * @param {Object} obj
     * @example
     * var student = {
     *     name: "yoyoyohamapi",
     *     age: 13
     * };
     * function Hobby(){
     *     this.hobby = "soccer";
     * }
     * Hobby.prototype.hate = "volleyball";
     * _.extend(student, new Hobby(),{sex:"boy"});
     * // => student: {
     *     name: "yoyoyohamapi",
     *     age: 13,
     *     hobby: "soccer",
     *     hate: "volleyball", // 原型链上的属性也被继承了
     *     sex: "boy"
     * }
     */
    _.extend = createAssigner(_.allKeys);

    /**
     * 类似于_.extend方法，但是只会将目标对象的自身属性分配到obj，
     * @param {Object} obj
     * @param {...Object} ...sources
     * @alias _.assign
     * @example
     * var student = {
     *     name: "yoyoyohamapi",
     *     age: 13
     * };
     * function Hobby(){
     *     this.hobby = "soccer";
     * }
     * Hobby.prototype.hate = "volleyball";
     * _.extend(student, new Hobby(),{sex:"boy"});
     * // => student: {
     *     name: "yoyoyohamapi",
     *     age: 13,
     *     hobby: "soccer",
     *     sex: "boy"
     * }
     */
    _.extendOwn = _.assign = createAssigner(_.keys);

    /**
     * 通过真值检测函数predicate找到对象中第一个满足条件的key
     * @param {Object} obj
     * @param {Function} predicate
     * @param {Object} context
     * @example
     * var student = {
     *      name: "wxj",
     *      age: 13
     * };
     * var predicate = function(value, key, obj) {
     *     return key === 'age' && value==13;
     * }
     * var key = _.findKey(student, predicate);
     * // => "age"
     */
    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

    /**
     * 一个helper，用来判断某个key是否存在于对象当中
     * @param {Object} value
     * @param {String} key
     * @param {Object} obj
     */
    var keyInObj = function (value, key, obj) {
        return key in obj;
    };

    /**
     * 返回obj的拷贝，该拷贝只包含白名单的属性
     * @param {object} obj
     * @param {...string|function} whitelist 属性白名单或者条件函数
     * @example
     * var student = {
     *     name: 'wxj',
     *     age: 13,
     *     family: {
     *         son: 'lcx'
     *     },
     *     hobby: 'soccer'
     * };
     * var student2 = _.pick(student, 'name', 'age');
     * var student3 = _.pick(student, function(value, key, obj){return key === 'age';})
     * var student4 = _.pick(student, ['family',['son']])
     * // =>
     * student2: {
     *     name: 'wxj',
     *     age: 13
     * },
     * student3: {
     *     age: 13
     * },
     * student4: {
     *     family: {
     *         son: 'lcx'
     *     }
     * }
     */
    _.pick = restArgs(function (obj, keys) {
        var result = {}, iteratee = keys[0];
        if (obj == null) return result;
        // 白名单机制最终都会落脚到一个真值检验函数上，无论第二个参数是一个函数还是一个个的keys
        if (_.isFunction(iteratee)) {
            if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
            keys = _.allKeys(obj);
        } else {
            // 如果第二个参数是一系列的key，则暗示pick的条件根据key是否在obj中进行pick
            iteratee = keyInObj;
            // 将keys展平
            keys = flatten(keys, false, false);
            // obj = Object(obj) 的深刻含义
            // 1. 如果obj是一个对象，那么Object(obj)返回obj
            // 2. 如果obj是undefined或null，那么Object(obj)返回一个{}
            // 3. 如果obj是一个原始值(Primitive value)，那么Object(obj)返回一个被包裹的原始值:
            // var obj = 2;
            // obj = Object(obj); // 相当于new Number(obj);
            // => obj: Number {[[PrimitiveValue]]: 2}
            // var value = obj.valueOf();
            // => value: 2
            // 可以看到，Object(obj)手段就是将传入obj对象化
            obj = Object(obj);
        }
        // 开始pick
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    });

    /**
     * 返回obj的拷贝，该拷贝会丢弃黑名单中的属性
     * @param {object} obj
     * @param {...string|function} blacklist 黑名单或条件函数
     *
     */
    _.omit = restArgs(function (obj, keys) {
        // 可以看到，_.omit的实现基于_.pick
        var iteratee = keys[0], context;
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
            // 如果传入了条件函数，那么取下一个参数为执行上下文
            if (keys.length > 1) context = keys[1];
        } else {
            keys = _.map(flatten(keys, false, false), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    });

    /**
     * 用默认的一些对象defaults填充obj
     * 所谓填充，也就是只会obj中未定义（undefined）的属性
     * @param {object} obj
     * @param {...object} defauts
     */
    _.defaults = createAssigner(_.allKeys, true);

    /**
     * 创建一个对象，该对象继承自指定的原型prototype
     * @param {function} prototype
     * @param {...object} props 同时也支持指定更多的props供对象扩展
     * @return {object}
     */
    _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    };

    /**
     * 浅克隆一个对象
     * @param {object|array} obj 待克隆对象
     */
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        // 可以看出，如果obj是一个对象，那么该函数基于_.extend实现
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    /**
     * 在链式调用的过程中的某一环，对obj执行相应的interceptor后继续链式调用
     * @param {object} obj
     * @param {function} interceptor
     * @example
     * _.chain([1,2,3,200])
     * .filter(function(num) { return num % 2 == 0; })
     * .tap(alert)
     * .map(function(num) { return num * num })
     * .value();
     * => // [2, 200] (alerted)
     * => [4, 40000]
     */
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    /**
     * 校验一个object是否满足匹配的键值对
     * @param {object} object
     * @param {object} attrs
     * @example
     */
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            // 一旦遇到value不等， 或者attrs中的key不在obj中，立即返回false
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };


    // Internal recursive comparison function for `isEqual`.
    // 递归比较a,b
    var eq, deepEq;
    /**
     * 递归比较a、b
     * eq(null, undefined) = true
     *
     *
     */
    eq = function (a, b, aStack, bStack) {
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        // 即便a===b, 还是要校正0 === -0,
        // 在原生js中，0 === -0, 1/0 === 1/0 , 1/-0 !== 1/0
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // 如果 a!==b，由于null == undefined，所以为了避免==判定失效
        // 在a、b中存在null，需要通过 === 判断
        if (a == null || b == null) return a === b;
        // 如果a、b都是NaN，在原生的js中是不等的(NaN != NaN, NaN !== NaN)，但他们更应当被认为是相等的
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        // 如果a、b都是立即数，a!==b 就意味着他们真的不等
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        // 如果a,b是function获得object（数组也是object）则意味着二者需要深度比较
        return deepEq(a, b, aStack, bStack);
    };

    /**
     * 深度比较a、b
     *
     *
     *
     */
    deepEq = function (a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // 如果是对象，需要根据其所属“类Class”判断
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                // var a = new Date();
                // +a; // => 1464867835038
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        // 除此之外，a,b仅可能是对象或者数组，判断就较为复杂
        var areArrays = className === '[object Array]';
        // 非数组比较， 先判断不等的可能，提前判断出不等而不是相等，是因为判断相等可能涉及到递归
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            // 构造函数不同的对象必然不等，
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                _.isFunction(bCtor) && bCtor instanceof bCtor)
                && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }

        // 这两个栈用来解决对象存在循环引用时的比较
        // var a={
        //     name: 'wxj',
        //     toSelf: a
        // };
        // var b={
        //     name: 'wxj',
        //     toSelf: b
        // };
        // 二者语义上应当是相等的，因为toSelf只是指向自身，并没有实际意义
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // 递归地比较数组
        if (areArrays) {
            length = a.length;
            // 提前进行不等判断，避免之后的递归过程
            if (length !== b.length) return false;
            while (length--) {
                // 深度比较
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // 递归地比较对象
            var keys = _.keys(a), key;
            length = keys.length;
            // 提前进行不等判断，避免之后的递归过程
            if (_.keys(b).length !== length) return false;
            while (length--) {
                // 深度比较
                key = keys[length];
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    /**
     * 对a，b进行深度比较，判断a，b是否相等
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    _.isEqual = function (a, b) {
        return eq(a, b);
    };

    /**
     * 判断obj是否为空
     * @param {object} obj
     * @example
     * _.isEmpty({}); // => true
     * _.isEmpty([]); // => true
     * _.isEmpty(''); // => true
     */
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        // {} 也被认为是空的
        return _.keys(obj).length === 0;
    };

    /**
     * 判断obj是否是DOM元素，不严格，
     * @param {*} obj
     * @example
     * // 这个判定不够严格
     * var a={};
     * a.nodeType === 1;
     * _.isElement(a); // => true
     */
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    /**
     * 判断obj是否是数组，默认用ES5原生的Array.isArray判断
     * @param {*} obj
     */
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    /**
     * 判断obj是否是对象，函数也属于对象
     * @param {*} obj
     * @example
     * _.isObject(function(){}); // => true
     */
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // 添加一些is判断方法,
    // 判断一个对象的类型主要是通过Object.prototype.toString()方法
    // 例如, 如果对象是String类型, 则Object.prototype.toString.call(obj) === '[object String]'
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    // IE9以下, 对于对象是否是参数, 需要通过判断该对象是否含有callee属性进行判断
    if (!_.isArguments(arguments)) {
        // 判断obj是否是argumens
        // 只有arguments才会有callee属性
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }

    // 纠正老的v8引擎下的isFunction判断
    var nodelist = root.document && root.document.childNodes;
    if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    /**
     * 判断obj是否有限
     * @param {object} obj
     */
    _.isFinite = function (obj) {
        return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
    };

    /**
     * 判断obj是否是NaN
     * @param {object} obj
     */
    _.isNaN = function (obj) {
        return _.isNumber(obj) && isNaN(obj);
    };

    /**
     * 判断obj是否是boolean
     * @param {object} obj
     */
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    /**
     * 判断obj是否为null
     * @param {*} obj
     */
    _.isNull = function (obj) {
        return obj === null;
    };

    /**
     * 判断obj是否是undefined
     * @param {*} obj
     */
    _.isUndefined = function (obj) {
        // undefined存在被污染的可能
        return obj === void 0;
    };

    /**
     * 判断对象是否具有属性key，只判断自由属性
     * @param {object} obj
     * @param {string} key
     */
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // 工具函数部分
    // -----------------

    /**
     * 返回一个underscore对象，把_所有权交还给原来的拥有者（比如lodash）
     * @example
     * var underscore = _.noConflict()
     */
    _.noConflict = function () {
        // 回复原来的_指代的对象
        root._ = previousUnderscore;
        // 返回underscore对象
        return this;
    };

    /**
     * 返回值本身
     * @param value
     * @returns {*}
     */
    _.identity = function (value) {
        return value;
    };

    /**
     * 返回一个函数，返回的函数都够返回value自身
     * 让我们以函数的方式来思考变量
     * @param {*} value
     * @example
     * var stooge = {name: 'moe'};
     * stooge === _.constant(stooge)();
     */
    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    /**
     * 空函数
     * 可以用来为某个对象的方法赋值初始值
     * 以前：
     * var a = {
     *     doSomething: null;
     * };
     * a.doSomething = function() {console.log("doing");}
     * // 某个业务需要的地方，需要额外判断
     * _.isFunction(a.doSomething) && a.doSomething();
     * 现在：
     * var a = {
     *     doSomething: _.noop
     * };
     * a.doSomething = function() {console.log("doing");}
     * // 不再需要判断
     * a.doSomething();
     */
    _.noop = function () {
    };

    /**
     * 返回一个获取指定对象某属性的方法
     * @param {string} key
     * @example
     * var nameOf = _.property('name');
     * var stu = {
     *     name: "wxj",
     *     age: 13
     * };
     * nameOf(stu); //=> "wxj"
     *
     */
    _.property = property;

    /**
     * 返回能够获得某个对象指定属性的方法
     * @param {object} obj
     * @example
     * var stu = {
     *     name: "wxj",
     *     age: 13
     * };
     * var getStuProperty = _.propertyOf(stu);
     * getStuProperty('name'); // "wxj"
     */
    _.propertyOf = function (obj) {
        return obj == null ? function () {
        } : function (key) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    /**
     * 返回一个属性检测函数，检测某个对象是否具有指定属性
     * @param {object} attrs 属性集合
     * @example
     * var mathcerAge = _.matcher({age:13});
     * var stu = {
     *     name: "wxj",
     *     age: 13
     * };
     * matcherAge(stu); // true
     */
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        };
    };

    /**
     * 执行一个函数n次，返回每次执行结果构成的数组
     * @param {int} n 执行次数
     * @param {function} iteratee 被执行函数
     * @param {object} context 执行上下文
     * @example
     * function getIndex(index) {
     *  return index;
     * }
     * var results = _.times(3, getIndex); // => [0,1,2]
     */
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    /**
     * 返回一个值在[min,max]之间的随机数
     * @param min 左边界
     * @param max 右边界
     * @returns {*}
     */
    _.random = function (min, max) {
        // 如果没有设定右边界, 则返回[0, min]之间的随机数
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    /**
     * 获得当前时间的时间戳
     */
    _.now = Date.now || function () {
        return new Date().getTime();
    };

    // 定义一系列需要逃逸的html字符
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    // 反逃逸Map
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    /**
     * 返回一个能够获得字符串转义或反转义结果的函数
     * @param {object} map 如果是要转义，传递escapeMap，如果是反转义，传递unescapeMap
     *
     */
    var createEscaper = function (map) {
        var escaper = function (match) {
            // 每次捕获通过map中创建的映射进行替换
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped.
        // 动态创建正则表达式，不捕获
        var source = '(?:' + _.keys(map).join('|') + ')';
        // 测试正则与替换正则
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');

        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };

    /**
     * 转义html特殊字符
     * @param {string} string 待转义字符
     */
    _.escape = createEscaper(escapeMap);

    /**
     * 取消转义
     * @param {string} string 待取消转义字符
     */
    _.unescape = createEscaper(unescapeMap);

    /**
     * 如果object的prop属性是一个成员方法，调用它获得结果，否则直接过得object的prop属性的值
     * @param {object} object
     * @param {string} prop 属性
     * @param {function} fallback 回退函数，当object或者其prop非法时会被调用
     */
    _.result = function (object, prop, fallback) {
        var value = object == null ? void 0 : object[prop];
        if (value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? value.call(object) : value;
    };

    /**
     * 通过自增，产生一个全局唯一的整形id
     *
     *
     */
    var idCounter = 0;

    /**
     * 根据传入的prefix，产生全局唯一的id
     * @param {string} prefix id前缀
     * @example
     * var prefix = "wxj";
     * var id1 = _.uniqueId(prefix); // => wxj1
     * var id2 = _.uniqueId(prefix); // => wxj2
     */
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // 默认情况下，undersocre使用[ERB风格的模板](http://www.stuartellis.eu/articles/erb/)
    // 但是也可以手动配置
    _.templateSettings = {
        // 执行体通过<% %>包裹
        evaluate: /<%([\s\S]+?)%>/g,
        // 插入立即数通过<%= %>包裹
        interpolate: /<%=([\s\S]+?)%>/g,
        // 逃逸通过<%- %>包裹
        escape: /<%-([\s\S]+?)%>/g
    };

    // 如果不想使用interpolation、evaluation、escaping正则，
    // 必须使用一个noMatch正则来保证不匹配的情况
    var noMatch = /(.)^/;

    // 定义需要逃逸的字符，以便他们之后能够被运用到模板中的字符串字面量中
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028', // 行分隔符
        '\u2029': 'u2029' // 行结束符
    };

    // 逃逸正则
    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

    /**
     * 转义字符
     * @param {string} match
     */
    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    /**
     * underscore实现的一个js微模板引擎
     * @param {string} text
     * @param {object} settings 模板配置
     * @param {object} oldSettings 该参数用以向后兼容
     */
    _.template = function (text, settings, oldSettings) {
        // 校正模板配置
        if (!settings && oldSettings) settings = oldSettings;
        // 获得最终的模板配置
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        // 获得最终的匹配正则
        // /<%([\s\S]+?)%>/g|/<%=([\s\S]+?)%>/g|/<%-([\s\S]+?)%>/g|$/g

        var matcher = RegExp([
                (settings.escape || noMatch).source, // /<%([\s\S]+?)%>/g.source === '<%([\s\S]+?)%>'
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        //
        var index = 0;
        // source用来保存最终的函数执行体
        var source = "__p+='";
        // 正则替换模板内容，逐个匹配，逐个替换
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            // offset 匹配到的子字符串在原字符串中的偏移量。
            //（比如，如果原字符串是“abcd”，匹配到的子字符串时“bc”，那么这个参数将时1）

            // 开始拼接字符串。进行字符逃逸
            source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            // 从下一个匹配位置开始
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offset.
            return match;
        });

        //
        source += "';\n";
        // If a variable is not specified, place data values in local scope.
        // 如果没有在settings中声明变量
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        var render;
        try {
            // 动态创建渲染函数
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        // 最终返回一个模板函数，通过给模板传递数据
        // 最后通过render来渲染结果
        var template = function (data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    /**
     * 链式处理obj，该方法获得一个经underscore包裹后的对象
     * @param {object} obj 被包裹对象
     *
     */
    _.chain = function (obj) {
        // 获得一个经underscore包裹后的实例
        var instance = _(obj);
        // 标识当前实例支持链式调用
        instance._chain = true;
        return instance;
    };

    // OOP
    // underscore 也指出OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var chainResult = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
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
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return chainResult(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return chainResult(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return String(this._wrapped);
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    // 如果是AMD调用,则需要做一个AMD的wrapper
    if (typeof define == 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}());
