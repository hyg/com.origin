var yaml = require('js-yaml');
var os = require('os');
var fs = require('fs');
var Hashes = require('jshashes');
var http = require('http');
var child  =  require('child_process');
var events = require('events');
var emitter = new events.EventEmitter();

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

// read the log and find the PM's account
// now is huangyg. just for debug...
var PMID = "56bf5fcf1697d2f088dd1e4461660df5a37aa194"; // the PM

exports.month = month;
exports.year = year;

function year(stream){
	console.log("year() called");
}

function month(stream){
	// check the log make sure it is the first
	// now it is true. just for debug...
	if (false)
		return ;

	var data = new Object();
	var input = new Object();
	var output = new Object();
	data.jtid = '1c636fec7bdfdcd6bb0a3fe049e160d354fe9806';	// just for debug
	input.id = '1c636fec7bdfdcd6bb0a3fe049e160d354fe9806';	// just for debug
	input.amount = 1024;
	data.input = input;
	output.id = PMID
	output.amount = 1024;
	data.output = output;
	data.total = 1024;
	data.time = new Date().toLocaleString();
	data.remark = "PM's monthly salary";
	console.log(data);
	
	var datastr = yaml.safeDump(data);
	var item = new Object();
	item.type = 3;
	item.data = datastr;
	item.hashtype = 1;
	item.hash = new Hashes.SHA512().b64(datastr);
	
	doc = yaml.safeDump(item);

	var postbody = new Object();
	
	postbody.cod = "";
	postbody.tag = "transfer";
	postbody.author = "ITW";
	postbody.log = doc;
	
	postbody = yaml.safeDump(postbody);
	console.log(postbody);
	
	var options = {
	  hostname: config.server.url,
	  port: config.server.port,
	  method: 'POST',
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

	req.write(postbody);
	req.end();
}