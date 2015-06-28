
var fs = require('fs');
var http = require('http');

var url = require("url"),
	yaml = require('js-yaml'),
	map = require('through2-map'),
	mime = require("mime").types;

var PutIdx = yaml.safeLoad(fs.readFileSync('put/index.yaml', 'utf8'));
var PostIdx = yaml.safeLoad(fs.readFileSync('post/index.yaml', 'utf8'));

var server = http.createServer(function (req, res) {
	if(req.method == 'POST') {
		req.pipe(map(function (chunk) {
			console.log('BODY: ' + chunk);
			console.log('BODY length: ' + chunk.length);
			var body = yaml.load(chunk);
			
			if (body.cod == "") {
				key = body.tag + "." + body.author;
			} else {
				key = body.cod + "." + body.tag;
			}
			if (!PostIdx.hasOwnProperty(key)) {
			//if (! (key in PostIdx)) { 
				PostIdx[key] = 0;
				PostIdx.update = new Date().toLocaleString();
				fs.writeFile("post/index.yaml",yaml.safeDump(PostIdx),function(err){
					console.log("post notify: create a new key ["+key+"].\n");
				});
				
			}
			
			var filename;
			if (body.cod == "") {
				filename = "post/" + body.tag + "." + body.author + "." + (PostIdx[key]+1) + ".yaml";
			} else {
				filename = "post/" + body.cod + "." + body.tag + "." + body.author + "." + (PostIdx[key]+1) + ".yaml";
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
						res.write( "post: "+filename+" saved.");
						res.end();
						console.log("post: "+filename+" saved.");
						
						PostIdx[key] = PostIdx[key] + 1;
						PostIdx.update = new Date().toLocaleString();
						fs.writeFileSync("post/index.yaml",yaml.safeDump(PostIdx));
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
				filename = "put/" + body.tag + "." + body.author ;
			} else {
				filename = "put/" + body.cod + "." + body.tag + "." + body.author ;
			}
			if (body.index == -1) {
				filename = filename + ".yaml";
			} else {
				filename = filename + "." + body.index + ".yaml";
			}
			
			fs.exists(filename, function (exists) {
				if (exists) {
					res.writeHead(202, {'Content-Type': 'text/plain'});
					res.write( "put: "+filename+" updated.");
					res.end();
					console.log("put: "+filename+" updated.");
				} else {
						res.writeHead(201, {'Content-Type': 'text/plain'});
						res.write( "put: "+filename+" saved.");
						console.log("put: "+filename+" saved.");
						res.end();
				}
			});
				
			fs.writeFile(filename,yaml.safeDump(body),function(err){
				if(err) throw err;

				PutIdx[filename] = new Date().toLocaleString();
				PutIdx.update = new Date().toLocaleString();
				fs.writeFileSync("put/index.yaml",yaml.safeDump(PutIdx));
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
