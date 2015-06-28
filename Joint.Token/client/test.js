var https = require('https');
var fs = require('fs');
var events = require('events');
var emitter = new events.EventEmitter();

var ticket = require('./ticket')

emitter.on("ticket1",eval("ticket.t1"));
emitter.on("ticket2",ticket.t2);
emitter.emit("ticket1");

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