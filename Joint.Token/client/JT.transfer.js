var openpgp = require('openpgp');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var yaml = require('js-yaml');
var http = require('http');
var Hashes = require('jshashes')
var check = require('./JT.check');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
var secuserinfo = new Object();
var pubuserinfo = new Object();
var balance = new Object();

check.getBalance(listkey);


function listkey(b) {
	balance = b;
	secuserinfo = new Object();
	pubuserinfo = new Object();
	
	var files = fs.readdirSync(".");
	// list the private key
	files.forEach(function(item) {
		if (path.extname(item) === '.sec'){
			var seckey = openpgp.key.readArmored(fs.readFileSync(item,'utf8')).keys[0];
			secuserinfo[seckey.primaryKey.fingerprint] = seckey.users[0].userId.userid;
		}
	});
	
	files = fs.readdirSync("put/");
	// list the public key
	files.forEach(function(item) {
		if(item.substr(0,4) == "nor."){
			var putbody = yaml.safeLoad(fs.readFileSync("put/"+item,'utf8'));
			var cfg = yaml.safeLoad(putbody.cfg);
			var pubkey = openpgp.key.readArmored(cfg.pubkey).keys[0];
			pubuserinfo[pubkey.primaryKey.fingerprint] = pubkey.users[0].userId.userid;
		}else if(item.substr(0,5) == "auto."){
			var putbody = yaml.safeLoad(fs.readFileSync("put/"+item,'utf8'));
			var cfg = yaml.safeLoad(putbody.cfg);

			pubuserinfo[cfg.id] = putbody.author;
		}
	});
	
	console.log("可选的付款人:")
	for (var key in secuserinfo) {
		console.log("账号：\t"+key+"\n户主：\t"+secuserinfo[key]+"\n余额：\t"+b[key]+"\n");
	}
	
	console.log("可选的收款人:")
	for (var key in pubuserinfo) {
		console.log("账号：\t"+key+"\n户主：\t"+pubuserinfo[key]+"\n余额：\t"+b[key]+"\n");
	}
	
	askandtransfer();
}

function askandtransfer(){
	process.stdin.setEncoding('utf8');
	process.stdout.setEncoding('utf8');
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	// choice one as payer
	var payer,payee,amount,passphrase;

	rl.question("\n\n请输入付款人name：\n", function(answer) {
		payer = answer;
		rl.question("请输入收款人name：\n", function(answer) {
			payee = answer;
			rl.question("请输入付款金额：\n", function(answer) {
				var input = Number(answer);
				if (isNaN(input)) {
					console.log("金额不对呀");
				} else {
					amount = input;
					var payerpubkey = openpgp.key.readArmored(fs.readFileSync(payer + ".pub",'utf8')).keys[0];
					if(balance[payerpubkey.primaryKey.fingerprint] < amount) {
						console.log("余额不足。");
						//return;
						process.exit()
					};

					rl.question("请输入付款人私钥口令：\n", function(answer) {
						passphrase = answer;
						rl.close();
						
						transfer(payer,payee,amount,passphrase);
					});
				}
			});
		});
	});
}


/*
* type: 账目种类
	* 1:issue
	* 2:destroy
	* 3:transfer
	* 4:offer
	* 5:match
	* 6:alloc
* data: 账目数据
* hashtype:哈希算法类型
	* 1:SHA512
	* 2:SHA256
* hash：哈希值
* sigtype:签名类型
	- 1:rsa
	- 2:openpgp
* sig: 一个字符串数组，每个成员是一个数字签名。
*/

function transfer(payerid,payeeid,amount,passphrase){
	var payersecfile = payerid + ".sec";
	//var payerpubfile = payerid + ".pub";
	var payerseckey = openpgp.key.readArmored(fs.readFileSync(payersecfile,'utf8')).keys[0];
	//var payerpubkey = openpgp.key.readArmored(fs.readFileSync(payerpubfile,'utf8')).keys[0];
	
	var payeepubfile = payeeid + ".pub";
	var payeepubkey = openpgp.key.readArmored(fs.readFileSync(payeepubfile,'utf8')).keys[0];
	
	var data = new Object();
	var input = new Object();
	var output = new Object();
	data.jtid = '1c636fec7bdfdcd6bb0a3fe049e160d354fe9806';	// just for debug
	input.id = payerseckey.primaryKey.fingerprint;
	input.amount = amount;
	data.input = input;
	output.id = payeepubkey.primaryKey.fingerprint;
	output.amount = amount;
	data.output = output;
	data.total = amount;
	data.time = new Date().toLocaleString();
	data.remark = "transfer sample";
	console.log(data);
	
	var datastr = yaml.safeDump(data);
	var item = new Object();
	item.type = 3;
	item.data = datastr;
	item.hashtype = 1;
	item.hash = new Hashes.SHA512().b64(datastr);
	
	if(payerseckey.decrypt(passphrase)){
		openpgp.signClearMessage(payerseckey,datastr).then(function(pgpMessage){
			// success
			console.log(pgpMessage);
			item.sigtype = 2;
			item.sig = pgpMessage;
			doc = yaml.safeDump(item);
			
			var authorseckey = payerseckey;
			var postbody = new Object();
			
			postbody.cod = "";
			postbody.tag = "transfer";
			postbody.author = payerid;
			postbody.log = doc;
			openpgp.signClearMessage(authorseckey,doc).then(function(pgpMessage){
				// success
				
				postbody.sig = pgpMessage;
				postbody = yaml.safeDump(postbody);
				
				console.log(postbody);
				console.log(postbody.length);
				//fs.writeFileSync("postbody.yaml",postbody)
				
				var options = {
				  hostname: config.server.url,
				  port: config.server.port,
				  method: 'POST',
				  headers: {
					'Content-Type': 'application/x-yaml'
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
				
			}).catch(function(error) {
				// failure
				console.log("签名失败！"+error);
			});		
		}).catch(function(error) {
			// failure
			console.log("签名失败！"+error);
		});		
	}
}