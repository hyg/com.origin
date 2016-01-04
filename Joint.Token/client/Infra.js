var fs = require('fs');
var yaml = require('js-yaml');
var openpgp = require('openpgp');
var events = require('events');

var emitter = new events.EventEmitter();
var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
exports.emitter = emitter ;
exports.config = config ;

exports.getCODlist = getCODlist ;
exports.getCODObj = getCODObj ;


exports.createNor = createNor ;
exports.sync = sync ;
exports.getCODlist = getCODlist ;
exports.getCODlist = getCODlist ;
exports.getCODlist = getCODlist ;
exports.getCODlist = getCODlist ;
exports.getCODlist = getCODlist ;



function getCODlist(){
	
}

function getCODObj(){
	
}

function createNor(name,id,email,passphrase){
	var UserId = name + " (" + id + ") <" + email + ">" ;
	
	var publicKey,privateKey;
	var opt = {numBits: 2048, userId: UserId, passphrase: passphrase};

	console.log("正在创建密钥对，需要几十秒时间，请稍候。。。");

	openpgp.generateKeyPair(opt).then(function(key) {
		var data = new Object();
		
		data.id = key.key.primaryKey.fingerprint;
		data.keytype = 2;
		data.pubkey = key.publicKeyArmored;
		data.createtime =  new Date().getTime();//Date.parse(key.key.primaryKey.created);
		data.remark = "Normal Account";
		
		//doc = yaml.safeDump(data);
		var authorseckey = openpgp.key.readArmored(key.privateKeyArmored).keys[0];
		
		var item = new Object();
		
		//item.cod = "";
		item.tag = "nor";
		item.author = id;
		item.data = data;
		item.sigtype = 0;
		
		sent(item,'POST',function(retstr){
			fs.writeFile(retstr+".pub",key.publicKeyArmored,function(err){
				if(err) throw err;
			});
			fs.writeFile(retstr+".sec",key.privateKeyArmored,function(err){
				if(err) throw err;
			});
		});
	});
}




// distribute storage
function sent(item,method,callback){
	var itemyaml = yaml.safeDump(item);
	var options = {
	  hostname: config.server.url,
	  port: config.server.port,
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/x-yaml'
	  }
	};
	
	console.log("sending account to server...\n",options)
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
		callback(chunk);
	  });
	});
	req.write(itemyaml);
	req.end();
}

function sync() {
	
}



// distribute event driver