//var greeter=require('./greeter.json');
import greeter from './greeter.json'
export default function(){
	var span=document.createElement('span')
	span.textContent= greeter.Msg
	return span
}
