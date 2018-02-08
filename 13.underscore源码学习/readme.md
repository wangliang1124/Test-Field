 参考资料：

  * Underscore.js源码解读&系列文章 
    https://github.com/hanzichi/underscore-analysis 
    源码注释：https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js
  * Underscore源码分析 
    https://www.gitbook.com/book/yoyoyohamapi/undersercore-analysis/details
    源码注释：https://github.com/yoyoyohamAPI/underscore/blob/master/underscore.analysis.js


学习方法： 照敲代码，注释之


1.  i++ a和 ++i 的区别
  The value i++ is the value of i before the increment. The value of ++i is the value of i after the increment.
  Example:
    `
      var i = 42;
      alert(i++); // shows 42
      alert(i); // shows 43
      i = 42;
      alert(++i); // shows 43
      alert(i); // shows 43
    `

