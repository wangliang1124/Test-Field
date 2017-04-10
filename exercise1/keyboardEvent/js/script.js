window.onload=function(){
	var start=document.getElementById('start');
	var title=document.getElementById('title');
	var timer=null;
	var status=true;

	//鼠标动作
	start.onclick=play;
	//键盘控制
	document.onkeyup=function(event){
		event=event || window.event;
		//console.log(event.keyCode);
		if(event.keyCode==32){
			play();
		}	
	}

	//
	function play(){
		if(status){
			var elems=['IPhone7','华为Mate10','小米MIX','红米NOTE','魅族5','锤子T2','小米5','充值卡100元','谢谢参与'];
			timer=setInterval(function(){
				var r=Math.floor(Math.random()*elems.length);
				title.innerHTML=elems[r];
			},50)
			start.innerHTML='停止';
			status=false;
		}else{
			clearInterval(timer);
			status=true;
			start.innerHTML='开始';
		}
	}


}


