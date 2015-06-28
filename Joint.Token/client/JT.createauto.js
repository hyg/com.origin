var fs = require('fs');
var readline = require('readline');
var yaml = require('js-yaml');
var http = require('http');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

makeauto();

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
	putbody = yaml.safeDump(obj);
	console.log(putbody);
	
	var options = {
	  hostname: config.server.url,
	  port: config.server.port,
	  method: 'PUT',
	  headers: {
		'Content-Type': 'application/json'
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