/* eslint-disable */
// 1. 单例模式: 一个类仅有一个实例

// 2. 策略模式： 定义一系列算法，封装起来，是他们可以相互替换

/* 使用策略模式计算奖金 */
// 2.1 最初的代码实现
var calculateBonus = function(performanceLevel, salary) {
  if( performanceLevel = 'S') {
    return salary * 4;
  }
  if( performanceLevel = 'A') {
    return salary * 3;
  }
  if( performanceLevel = 'B') {
    return salary * 2;
  }
};
calculateBonus('S', 8000) // => 32000
// 2.2 使用组合函数重构
var performanceS = function(salary) {
  return salary * 4;
}
var performanceA = function(salary) {
  return salary * 3;
}
var performanceB = function(salary) {
  return salary * 2;
}

var calculateBonus = function(performanceLevel, salary) {
  if( performanceLevel = 'S') {
    return performanceS()
  }
  if( performanceLevel = 'A') {
    return performanceA()
  }
  if( performanceLevel = 'B') {
    return performanceB()
  }
}
// 2.3 使用策略模式重构代码
var 


// 3. 代理模式