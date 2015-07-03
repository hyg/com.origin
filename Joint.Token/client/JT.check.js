var yaml = require('js-yaml');
var http = require('http');
var fs = require('fs');
var sync = require('./JT.sync');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
var postidx ;
var addr = "http://"+config.server.url+":"+config.server.port+'/post/index.yaml';
var balance = new Object();

sync.postsync(getidx);

function getidx(){
	postidx = yaml.safeLoad(fs.readFileSync('post/index.yaml', 'utf8'));
	check(postidx);
}

function check(idx) {
	for (var key in idx) {
		if(key.substr(0,9) == "transfer."){
			for (var i=1;i<=idx[key];i++) {
				var filename = 'post/'+key+"."+i.toString()+".yaml";
				
				var obj = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
				var log = yaml.safeLoad(obj.log);
				var data = yaml.safeLoad(log.data);
				
				read(data);
			}
		}
	}
	console.log(balance);
}

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