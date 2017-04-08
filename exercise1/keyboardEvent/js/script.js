window.onload=function(){	
	var start=document.getElementById('start');
	var title=document.getElementById('title');
	start.onclick=function(){
		var elems=['测试1','测试2','测试3'];
		setInterval(function(){
			var r=Math.floor(Math.random()*3);
			title.innerHTML=elems[r];
		},50)

	}
}