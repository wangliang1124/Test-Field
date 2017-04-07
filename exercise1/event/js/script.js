window.onload=function(){
		
		var box=document.getElementById('box');
		var go=document.getElementById('goto');

		eventUtil.addEventHandler(box,'click',function(){
			alert("我是父盒子");
		});
		eventUtil.addEventHandler(go,'click',function(e){
			e=eventUtil.getEvent(e);
			eventUtil.stopPropagation(e);
			eventUtil.preventDefault(e);

		});
		//eventUtil.removeEventHandler(btn3,'click',showMsg);

}