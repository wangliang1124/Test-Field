# TodoList-Vue

通过用Vue实现一个todolist，熟悉Vue的理念

* CSS3弹性布局，输入框边框添加圆角border-radius和阴影box-shadow
* HTML5新特性localStorage
* Vue指令：v-model,v-on,v-bind,v-for
* Vue选项对象参数 data,mounted,computed,methods,watch

遇到的问题：

1. `<span v-bind:class="{stage:'isFinished'}" v-bind:style="{background-position:0 -23px}"></span>`
    
    >console报错:"[Vue warn]: Error compiling template:",  - invalid expression: v-bind:style="{background-position:0 -23px}"
     
    解决：`v-bind:style="{backgroundPosition: '0 23px'}"`,backgroundPosition对应的值加单引号''

2. `data:{...items: this.fetch()...} `

	>报错：Uncaught (in promise) TypeError: Failed to execute 

	解决：	把data的值用函数返回
			`data:function() {
				return {
					items: this.fetch(),
					id:1,
					newItemText:'',
				}
			},`

3.`<statictics v-bind:num='statistics'></statictics>`
   >报错：网页显示" 今天已完成function boundFn(a) { var l = arguments.length; return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx) }个任务 "

   解决：`<statictics v-bind:num='statistics()'></statictics>`

4.给vue子组件穿动态的值无法实时显示出来？https://segmentfault.com/q/1010000011216302?_ea=2563680
 
 	解决：`Vue.component('statictics',{
			template:'<footer>今天已完成{{this.num}}个任务</footer>', //直接把引用num
			// data:function() {
			// 	return {
			// 		statistics:this.count
			// 	};
			// },
			props:['num']
		});',` 