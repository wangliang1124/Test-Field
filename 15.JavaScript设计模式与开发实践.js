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
// 4. 迭代器模式
// 5. 发布-订阅模式(观察者模式)
var salesOffices = {};
salesOffices.clientList = [];
// 6.命令模式
// 7.组合模式
// 8.模板方法模式
// 9.享元模式
// 10.责任链模式
// 11.中介者模式
// 12.装饰者模式
// 13.状态模式
// 14.适配器模式
// 设计原则：单一职责原则、里氏替换原则、依赖倒置原则、接口隔离原则、合成复用原则、最少知识原则