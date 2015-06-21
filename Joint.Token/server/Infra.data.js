
var fs = require('fs');
var http = require('http');

var url = require("url"),
	yaml = require('js-yaml'),
	map = require('through2-map'),
	mime = require("mime").types;

var CfgIdx = yaml.safeLoad(fs.readFileSync('data/cfg/index.yaml', 'utf8'));
var LogIdx = yaml.safeLoad(fs.readFileSync('data/log/index.yaml', 'utf8'));

var server = http.createServer(function (req, res) {
	if(req.method == 'POST') {
		req.pipe(map(function (chunk) {
			console.log('BODY: ' + chunk);
			var body = yaml.load(chunk);
			
			if (body.cod == "") {
				key = body.tag + "." + body.author;
			} else {
				key = body.cod + "." + body.tag;
			}
			if (!LogIdx.hasOwnProperty(key)) {
			//if (! (key in LogIdx)) { 
				LogIdx[key] = 0;
				LogIdx.update = new Date().toLocaleString();
				fs.writeFile("data/log/index.yaml",yaml.safeDump(LogIdx),function(err){
					res.writeHead(201, {'Content-Type': 'text/plain'});
					res.write("log notify: create a new key ["+key+"].\n");
					console.log("log notify: create a new key ["+key+"].\n");
				});
				
			}
			
			var filename;
			if (body.cod == "") {
				filename = "data/log/" + body.tag + "." + body.author + "." + (LogIdx[key]+1) + ".yaml";
			} else {
				filename = "data/log/" + body.cod + "." + body.tag + "." + body.author + "." + (LogIdx[key]+1) + ".yaml";
			}
			fs.exists(filename, function (exists) {
				if (exists) {
					res.writeHead(400, {'Content-Type': 'text/plain'});
					res.write( "log fail: file "+filename+" exist.");
					res.end();
					console.log("log fail: file "+filename+" exist.");
				} else {
					fs.writeFile(filename,yaml.safeDump(body),function(err){
						if(err) throw err;
						res.writeHead(201, {'Content-Type': 'text/plain'});
						res.write( "log: "+filename+" saved.");
						res.end();
						console.log("log: "+filename+" saved.");
						
						LogIdx[key] = LogIdx[key] + 1;
						LogIdx.update = new Date().toLocaleString();
						fs.writeFileSync("data/log/index.yaml",yaml.safeDump(LogIdx));
					});
				}
			})
		}))
	} 
	if(req.method == 'PUT') {
		req.pipe(map(function (chunk) {
			console.log('BODY: ' + chunk);
			var body = yaml.load(chunk);
			
			var filename;
			if (body.cod == "") {
				filename = "data/cfg/" + body.tag + "." + body.author ;
			} else {
				filename = "data/cfg/" + body.cod + "." + body.tag + "." + body.author ;
			}
			if (body.index == -1) {
				filename = filename + ".yaml";
			} else {
				filename = filename + "." + body.index + ".yaml";
			}
			
			fs.exists(filename, function (exists) {
				if (exists) {
					res.writeHead(202, {'Content-Type': 'text/plain'});
					res.write( "cfg: "+filename+" updated.");
					res.end();
					console.log("cfg: "+filename+" updated.");
				} else {
						res.writeHead(201, {'Content-Type': 'text/plain'});
						res.write( "cfg: "+filename+" saved.");
						console.log("cfg: "+filename+" saved.");
						res.end();
				}
			});
				
			fs.writeFile(filename,yaml.safeDump(body),function(err){
				if(err) throw err;
				console.log("cfg: "+filename+" saved.");
				
				CfgIdx[key] = new Date().toLocaleString();
				CfgIdx.update = new Date().toLocaleString();
				fs.writeFileSync("data/cfg/index.yaml",yaml.safeDump(CfgIdx));
			});
		}))
	} 
	if(req.method == 'GET') {
		var pathname = url.parse(req.url).pathname;
		var realPath = "data" + pathname;
		console.log(realPath);
		fs.exists(realPath, function (exists) {
			if (!exists) {
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.write("访问路径没有找到。");
				res.end();
			} else {
				//fs.createReadStream(realPath).pipe(res)
				fs.readFile(realPath, function(err, file){    
                    if ( err ) {    
                        res.writeHead(500, {'Content-Type': 'text/plain'});    
                        // res.write();    
                        res.end();    
                    } else {
						console.log(file);
                        res.writeHead(200, {'Content-Type':'text/plain'});    // or text/x-yaml  to make client save a file
                        res.write(file);    
                        res.end();    
                    }
                });
			}
		})
	}
  
});
server.listen(46372);
