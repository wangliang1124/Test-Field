new Vue({
	el:".container",
	data:{
		addressList:[],
		limitNum:3,
		currentIndex:0,
		shippingMethod:1
	},
	filters:{

	},
	computed:{
		filterAddress:function() {
			return this.addressList.slice(0,this.limitNum);
		}
	},
	mounted:function(){
		this.$nextTick(function() {
			this.getAddressList();
		});
	},
	methods:{
		getAddressList:function() {
			var _this=this;
			this.$http.get('data/address.json').then(function(response) {
				var res=response.data;
				if(res.status=='0'){
					_this.addressList=res.result;
					//console.log(res.result);
				}
			});
		},
		toggleMore:function() {
			if(this.limitNum==3){
				this.limitNum=this.addressList.length;
			}else{
				this.limitNum=3;
			}
		},
		setDefault:function(item) {
			this.addressList.forEach(function(address,index) {
				address.isDefault=false;
			});
			item.isDefault=true;
		}
	}
});