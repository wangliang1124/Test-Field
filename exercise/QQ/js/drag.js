function getByClass(clsName,parentId){
	var oParent = parentId?document.getElementById(parentId):document,
		elems=[],
		elements=oParent.getElementsByTagName("*");

		for(var i=0,l=elements.length;i<l;i++){
			if(elements[i].className==clsName){
				elems.push(elements[i]);
			}
		}
		return elems;
}

window.onload=drag;

function drag(){
	var oTittle=getByClass("login_logo_webqq","loginPanel")[0];

	//按下鼠标
	oTittle.onmousedown=function(){
		var oPanel=document.getElementById("loginPanel");
		var disX=event.clientX-oPanel.offsetLeft;
		var disY=event.clientY-oPanel.offsetTop;

		//拖动鼠标，整个面板跟随鼠标移动
		document.onmousemove=function(event){
			event =event || window.event;
			//document.title=event.clientX+","+event.clientY+","+event.screenX;
			var l=event.clientX-disX,
			    t=event.clientY-disY,
			    W=document.documentElement.clientWidth || document.body.clientWidth,
			    H=document.documentElement.clientHeight || document.body.clientHeight,
			    maxL=W-oPanel.offsetWidth-10,
			    maxT=H-oPanel.offsetHeight;
			if(l<0){
				l=0;
			}else if(l>maxL){
				l=maxL;
			}
			if(t<0){
				t=10;
			}else if(t>maxT){
				t=maxT;
			}
			oPanel.style.left=l+"px";
			oPanel.style.top=t+"px";
		}
	}
	
	//释放鼠标
	oTittle.onmouseup=function(){
		document.onmousemove=null;
		document.onmouseup=null;

	}

	//切换状态
	var loginState=document.getElementById("loginState"),
		statePanel=document.getElementById('loginStatePanel'),
		stateLists=statePanel.getElementsByTagName('li'),
		stateText=document.getElementById('login2qq_state_txt'),
		loginStateShow=document.getElementById('loginStateShow');

		loginState.onclick=function(event){
			event= event || window.event;
			if(event.stopPropagation){
				event.stopPropagation();	
			}else{
				event.cancelBubble=true;
			}
			statePanel.style.display='block';
		}

		for(var i=0;i<stateLists.length;i++){
			stateLists[i].onmousemove=function(){
				this.style.backgroundColor="#456";
			}
			stateLists[i].onmouseout=function(){
				this.style.backgroundColor="#FFF";
			}
			//点击状态列表
			stateLists[i].onclick=function(event){
				event= event || window.event;
				if(event.stopPropagation){
					event.stopPropagation();	
				}else{
					event.cancelBubble=true;
				}
				statePanel.style.display='none';
				var id =this.id;
				stateText.innerHTML=getByClass('stateSelect_text',id)[0].innerHTML;
				loginStateShow.className='login-state-show '+id;
			}
		}
		document.onclick=function(){
			statePanel.style.display='none';
		}

}