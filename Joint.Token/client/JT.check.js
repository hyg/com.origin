var yaml = require('js-yaml');
var http = require('http');
var fs = require('fs');
//var async = require('async');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
var postidx ;
var addr = "http://"+config.server.url+":"+config.server.port+'/post/index.yaml';
//console.log(addr);

getidx();

function getidx(){
	var req = http.get(addr, function(res) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		//console.log('BODY: ' + chunk);
		postidx = yaml.safeLoad(chunk);
		//console.log(postidx);
		check(postidx);

	  });
	}).on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
}

var cnt = 0;

function check(idx) {
	for (var key in idx) {
		if(key.substr(0,9) == "transfer."){
			cnt = cnt + idx[key];
			for (var i=1;i<=idx[key];i++) {
				var fileaddr = "http://"+config.server.url+":"+config.server.port+'/post/'+key+"."+i.toString()+".yaml";
				//console.log(fileaddr);
				var req = http.get(fileaddr, function(res) {
				  //console.log('STATUS: ' + res.statusCode);
				  //console.log('HEADERS: ' + JSON.stringify(res.headers));
				  res.setEncoding('utf8');
				  res.on('data', function (chunk) {
					//console.log('BODY: ' + chunk);
					var obj = yaml.safeLoad(chunk);
					var log = yaml.safeLoad(obj.log);
					var data = yaml.safeLoad(log.data);
					//console.log(data);
					read(data);
					cnt = cnt - 1;
					if (cnt == 0) {
						console.log(balance);
					}
				  });
				}).on('error', function(e) {
				  console.log('problem with request: ' + e.message);
				});
			}
			
		}
	}
}

var balance = new Object();

function read(data) {
	//checksig();
	var input = data.input;
	var output = data.output;
	//console.log(input);
	//console.log(output);
	
	var id = input.id;
	var amount = input.amount;
	existORcreate(id);
	balance[id] = balance[id] - amount;
	
	id = output.id;
	amount = output.amount;
	existORcreate(id);
	balance[id] = balance[id] + amount;
	/*
	for (var i in input){
		var id = input[i].id;
		var amount = input[i].amount;
		existORcreate(id);
		balance[id] -= amount;
	}
	
	for (var o in output){
		var id = output[o].id;
		var amount = output[o].amount;
		existORcreate(id);
		balance[id] += amount;
	}
	*/
}

function existORcreate(id) {
	//console.log(id);
	if (!balance.hasOwnProperty(id)) {
		balance[id] = 0;
	}
}