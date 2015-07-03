var yaml = require('js-yaml');
var http = require('http');
var fs = require('fs');
var async = require('async');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
var localPostIdx = yaml.safeLoad(fs.readFileSync('post/index.yaml', 'utf8'));
var localPutIdx = yaml.safeLoad(fs.readFileSync('put/index.yaml', 'utf8'));
var globalPostIdx ,globalPutIdx;
var postfileArray = new Array() ;
var putfileArray = new Array() ;

sync();

function sync() {
	postsync();
	putsync();
}

function postsync() {
	var addr = "http://"+config.server.url+":"+config.server.port+'/post/index.yaml';
	var req = http.get(addr, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			globalPostIdx = yaml.safeLoad(chunk);
			for (var key in globalPostIdx) {
				console.log("key:\t"+key);
				if (key == "update") continue;
				if (!localPostIdx.hasOwnProperty(key)) {
					localPostIdx[key] = 0;
				}
				console.log(localPostIdx[key]);
				console.log(globalPostIdx[key]);
				if (localPostIdx[key] < globalPostIdx[key]){
					for (var id = localPostIdx[key]+1;id <= globalPostIdx[key];id++) {
						console.log("key:\t"+key+"\tid:\t"+id);
						
						postfileArray.push(key+"."+id.toString()+".yaml") ;
						
						
					}
					localPostIdx[key] = globalPostIdx[key];
				}
			}
			
			console.log(postfileArray);
			
			async.each(postfileArray, function (item, callback) {
				var fileaddr = "http://"+config.server.url+":"+config.server.port+'/post/'+item;
				var filename = "post/"+item;
				var req = http.get(fileaddr, function(res) {
					res.setEncoding('utf8');
					res.on('data', function (chunk) {
						fs.writeFileSync(filename,chunk);
						console.log("post: "+filename+" saved.");
						callback(null);
					  });
				}).on('error', function(e) {
					console.log('problem with request: ' + e.message);
				});
			}, function (err) {
				if( err ) {
					console.log('A file failed to save');
				} else {
					console.log('All files have been saved successfully');
				}
			});
			
			localPostIdx.update = new Date().toLocaleString();
			fs.writeFileSync("post/index.yaml",yaml.safeDump(localPostIdx));
		});
	}).on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
}

function putsync() {
	var addr = "http://"+config.server.url+":"+config.server.port+'/put/index.yaml';
	var req = http.get(addr, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			globalPutIdx = yaml.safeLoad(chunk);
			for (var key in globalPutIdx) {
				console.log("key:\t"+key);
				if (key == "update") continue;
				if (!localPutIdx.hasOwnProperty(key)) {
					localPutIdx[key] = localPutIdx['update'];
				}
				console.log(localPutIdx[key]);
				console.log(globalPutIdx[key]);
				if (localPutIdx[key] < globalPutIdx[key]){
					putfileArray.push(key) ;
					localPutIdx[key] = globalPutIdx[key];
				}
			}
			
			console.log(putfileArray);
			
			async.each(putfileArray, function (item, callback) {
				var fileaddr = "http://"+config.server.url+":"+config.server.port+'/put/'+item;
				var filename = "put/"+item;
				var req = http.get(fileaddr, function(res) {
					res.setEncoding('utf8');
					res.on('data', function (chunk) {
						fs.writeFileSync(filename,chunk);
						console.log("Put: "+filename+" saved.");
						callback(null);
					  });
				}).on('error', function(e) {
					console.log('problem with request: ' + e.message);
				});
			}, function (err) {
				if( err ) {
					console.log('A file failed to save');
				} else {
					console.log('All files have been saved successfully');
				}
			});
			
			localPutIdx.update = new Date().toLocaleString();
			fs.writeFileSync("Put/index.yaml",yaml.safeDump(localPutIdx));
		});
	}).on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
}