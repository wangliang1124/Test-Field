new Vue({
	el:'#fooplayer',
	data:{
		list:[]
	},
	mounted:function() {
		this.$nextTick(function() {
			this.getList();
		});
	},
	methods:{
		getList:function() {
			// this.$http.jsonp('https://api.imjad.cn/cloudmusic',{'type':'playlist','id':'374755836'}).then(function(response) {
			// 	console.log(response.data);
			// });
			axios.get('https://api.imjad.cn/cloudmusic?type=playlist&id=374755836').then(function(response) {
				console.log(response.data);
			})
		}
	}
});