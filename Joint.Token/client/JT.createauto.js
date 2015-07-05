var fs = require('fs');
var yaml = require('js-yaml');
var https = require('https');
var http = require('http');
var Hashes = require('jshashes');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

makeauto("https://raw.githubusercontent.com/hyg/com.origin/11b720423a470ec0fc0affcc63e5f5ca1ee5688a/Joint.Token/client/ITW.auto.js");

function makeauto(url){
	https.get(url,function (response){
		response.on('data',function(data){
			console.log(data.toString());
			
			var auto = new Object();
			auto.id = new Hashes.SHA512().b64(data.toString());
			auto.codetype = 1;
			auto.codeurl = url;
			auto.createtime = new Date().toLocaleString();
			auto.remark = "ITW.auto";

			puttoserver(auto);

		});
		
	});
}

function puttoserver(obj){
	var putbody = new Object();
	
	putbody.cod = "";
	putbody.tag = "auto";
	putbody.author = "ITW";
	putbody.index = -1;
	putbody.cfg = yaml.safeDump(obj);;
	
	putbody = yaml.safeDump(putbody);
	console.log(putbody);
	
	var options = {
	  hostname: config.server.url,
	  port: config.server.port,
	  method: 'PUT',
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

	req.write(putbody);
	req.end();
}