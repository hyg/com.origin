var yaml = require('js-yaml');
var http = require('http');
var https = require('https');
var fs = require('fs');
var async = require('async');
var events = require('events');

var emitter = new events.EventEmitter();

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
var localPostIdx = yaml.safeLoad(fs.readFileSync('post/index.yaml', 'utf8'));
var localPutIdx = yaml.safeLoad(fs.readFileSync('put/index.yaml', 'utf8'));
var globalPostIdx ,globalPutIdx;
var postfileArray = new Array() ;
var putfileArray = new Array() ;

exports.sync = sync;
exports.postsync = postsync;
exports.putsync = putsync;

function sync(finish) {
	postsync(finish);
	putsync(finish);
}

function postsync(finish) {
	var addr = "http://"+config.server.url+":"+config.server.port+'/post/index.yaml';
	var req = http.get(addr, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			globalPostIdx = yaml.safeLoad(chunk);
			for (var key in globalPostIdx) {
				//console.log("key:\t"+key);
				if (key == "update") continue;
				if (!localPostIdx.hasOwnProperty(key)) {
					localPostIdx[key] = 0;
				}
				//console.log(localPostIdx[key]);
				//console.log(globalPostIdx[key]);
				if (localPostIdx[key] < globalPostIdx[key]){
					for (var id = localPostIdx[key]+1;id <= globalPostIdx[key];id++) {
						//console.log("key:\t"+key+"\tid:\t"+id);
						
						postfileArray.push(key+"."+id.toString()+".yaml") ;
						
						
					}
					localPostIdx[key] = globalPostIdx[key];
				}
			}
			
			//console.log(postfileArray);
			
			async.each(postfileArray, function (item, callback) {
				var fileaddr = "http://"+config.server.url+":"+config.server.port+'/post/'+item;
				var filename = "post/"+item;
				var req = http.get(fileaddr, function(res) {
					res.setEncoding('utf8');
					res.on('data', function (chunk) {
						fs.writeFileSync(filename,chunk);
						console.log("post: "+filename+" saved.");
						
						if((item.substr(item.indexOf(".")+1,5) == "auto.") || (item.substr(0,5) == "auto.")){
							var auto = yaml.safeLoad(chunk);
							var autofilename = item.substr(0,item.lastIndexOf(".")) + ".js" ;
							
							
							
							
							console.log("new auto account: download "+auto.data.codeurl+" and saved as "+autofilename);
							var autoget = https.get(auto.data.codeurl,function(res) {
								res.setEncoding('utf8');
								res.on('data', function (chunk) {
									fs.writeFileSync(autofilename,chunk);
									
									var a = require("./"+autofilename);
									for (var event in auto.data.listener){
										var lf = auto.data.listener[event] ;
										console.log("a."+lf);
										emitter.on(event,eval("a."+lf));
										console.log(emitter);
									}
								});
							});
						}
						
						callback();
					});
				}).on('error', function(e) {
					console.log('problem with request: ' + e.message);
				});
			}, function (err) {
				if( err ) {
					console.log('post:A file failed to save');
				} else {
					localPostIdx.update = new Date().toLocaleString();
					fs.writeFileSync("post/index.yaml",yaml.safeDump(localPostIdx));
					//console.log('post:All files have been saved successfully');
					if (typeof(finish) != "undefined") {
						finish();
					}
				}
			});
		});
	}).on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
}

function putsync(finish) {
	var addr = "http://"+config.server.url+":"+config.server.port+'/put/index.yaml';
	var req = http.get(addr, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			globalPutIdx = yaml.safeLoad(chunk);
			
			async.forEachOf(globalPutIdx, function (value, key, callback) {
				//console.log("key:\t"+key);
				if (key == "update") {
					callback();
					return;
				};
				if (!localPutIdx.hasOwnProperty(key)) {
					localPutIdx[key] = localPutIdx['update'];
				}
				//console.log(localPutIdx[key]);
				//console.log(globalPutIdx[key]);
				if (Date.parse(localPutIdx[key]) < Date.parse(globalPutIdx[key])){
					var fileaddr = "http://"+config.server.url+":"+config.server.port+'/put/'+key;
					var filename = "put/"+key;
					var req = http.get(fileaddr, function(res) {
						res.setEncoding('utf8');
						res.on('data', function (chunk) {
							fs.writeFileSync(filename,chunk);
							console.log("Put: "+filename+" saved.");
							callback();
						  });
					}).on('error', function(e) {
						console.log('problem with request: ' + e.message);
					});
					localPutIdx[key] = globalPutIdx[key];
				}
			},
			function (err) {
			  if( err ) {
					console.log('put:A file failed to save');
				} else {
					localPutIdx.update = new Date().toLocaleString();
					fs.writeFileSync("put/index.yaml",yaml.safeDump(localPutIdx));
					console.log('put:All files have been saved successfully');
					if (typeof(finish) != "undefined") {
						finish();
					}
				}
			});
		});
	}).on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
}