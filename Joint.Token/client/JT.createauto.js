var fs = require('fs');
var yaml = require('js-yaml');
var https = require('https');
var http = require('http');
var Hashes = require('jshashes');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

makeauto("https://raw.githubusercontent.com/hyg/com.origin/11b720423a470ec0fc0affcc63e5f5ca1ee5688a/Joint.Token/client/ITW.auto.js");

function makeauto(url){
	https.get(url,function (response){
		response.on('data',function(js){
			console.log(js.toString());
			
			var listener = new Object();
			listener["month"] = "month" ;
			listener["year"] = "year" ;
			
			var data = new Object();
			data.id = new Hashes.SHA512().b64(js.toString());
			data.codetype = 1;
			data.codeurl = url;
			data.listener = listener;
			data.createtime = new Date().getTime();
			data.remark = "ITW.auto";

			posttoserver(data);
		});
		
	});
}

function posttoserver(obj){
	var item = new Object();
	
	item.cod = "ITW";
	item.tag = "auto";
	item.author = "huangyg";
	item.data = obj;
	item.sigtype = 0;
	
	body = yaml.safeDump(item);
	console.log(body);
	
	var options = {
	  hostname: config.server.url,
	  port: config.server.port,
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/x-yaml'
	  }
	};
	
	console.log("sending transfer to server...")
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	  });
	});

	req.write(body);
	req.end();
}