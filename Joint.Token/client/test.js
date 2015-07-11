var https = require('https');
var fs = require('fs');
var yaml = require('js-yaml');
var events = require('events');
var emitter = new events.EventEmitter();
var serialize = require('node-serialize');

//var ticket = require('./ticket');

function temp(stream) {
	console.log(process.execPath);
	console.log(process.cwd());
	var ticket = require('./ticket');
	ticket.t2(stream);
}

//emitter.on("ticket1",eval("function t1(stream) {var ticket = require('./ticket');ticket.t1();}"));
emitter.on("ticket2",temp);



console.log(emitter);
var objS = serialize.serialize(emitter._events);
console.log(objS);

var obj = new events.EventEmitter();
obj._events = serialize.unserialize(objS);
console.log(obj);

//emitter.emit("ticket2");
obj.emit("ticket2");

/*
https.get("https://raw.githubusercontent.com/hyg/js.sample/master/learnyounode/6.module.js",function (response){
	response.on('data',function(data){
		//console.log(data.toString());
		fs.writeFile("a.js",data,function(err){
			var a = require("./a.js");
			a("C:/Users/huangyg/Desktop","pdf",function callback(err, data){
				if (err) throw err;
				
				for(var i=0;i<data.length;i++){
					console.log(data[i].toString())
				}
			});
		});
	});
	
});
*/