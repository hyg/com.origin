var os = require('os');
var child  =  require('child_process');
var events = require('events');
var emitter = new events.EventEmitter();

exports.t1 = t1;
function t1(stream){
	openbrowser("http://www.xuemen.com");
}

exports.t2 = t2;

function t2(stream){
	openbrowser("http://www.baidu.com");
}

function openbrowser(url) {
	switch (os.platform()) {
	case "linux":
		child.exec("xdg-open "+ url);
		break;
	case "win32":
	case "win64":
		//child.spawnSync("rundll32", "url.dll,FileProtocolHandler", url);
		//child.exec("start", url);
		child.exec("start "+url);
		break;
	case "darwin":
		child.exec("open "+ url);
		break;
	default:
		console.log("unsupported platform");
		break;
	};
}