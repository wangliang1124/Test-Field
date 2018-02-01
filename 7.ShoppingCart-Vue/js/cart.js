var app=new Vue({
	el:'#app',
	data:{
		totalMoney:0,
		productList:[],
		checkAllFlag:false,
		totalPrice:0,
		delFlag:false,
		curProduct:null 
	},
	filters:{
		formatMoney:function(value) {
			return '￥'+value.toFixed(2);
		}
	},
	mounted:function() {
		this.$nextTick(function() {
			this.cartView();
		});
	},
	methods:{
		cartView:function() {
			var _this=this;
			this.$http.get('data/cartData.json',{"id":123}).then(function(response) {
				_this.productList=response.body.result.list;
				_this.totalMoney=response.body.result.totalMoney;
			});
		},
		changeMoney:function(product,way) {
			if(way>0){
				product.productQuantity++;
			}else{
				product.productQuantity--;
				if(product.productQuantity<1){
					product.productQuantity=1;
				}
			}
			this.calcTotalPrice();
		},
		selectedProduct:function(item) {
			var flag=true;
			if(typeof item.checked==='undefined'){
				//Vue.set(item,'checked',true);
				this.$set(item,'checked',true);
			}else{
				item.checked=!item.checked;
			};
			this.productList.forEach(function(value,index) {
				if(!value.checked){
					flag=false;
				}
			});
			this.checkAllFlag=flag;
			this.calcTotalPrice();
		},
		checkAll:function(flag) {
			var _this=this;
			this.checkAllFlag=flag;
			this.productList.forEach(function(value,index) {
				if(typeof value.checked==='undefined'){
					_this.$set(value,'checked',flag);
				}else{
					value.checked=flag;	
				}
			});
			this.calcTotalPrice();
		},
		calcTotalPrice:function() {
			var _this=this;
			this.totalPrice=0;
			this.productList.forEach(function(item,index) {
				if(item.checked){
					_this.totalPrice+=item.productPrice*item.productQuantity;
				}
			});
		},
		delProduct:function() {

		},
		delConfirm:function(item) {
			this.delFlag=true;
			this.curProduct=item;

		},
		delProduct:function() {
			var index=this.productList.indexOf(this.curProduct);
			console.log(index);
			this.productList.splice(index,1);
			this.delFlag=false;
			this.calcTotalPrice();
		}
	}
});
Vue.filter('money',function(value,type) {
	return '￥'+value.toFixed(2)+type;
});