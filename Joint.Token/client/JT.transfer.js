var openpgp = require('openpgp');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var yaml = require('js-yaml');
var http = require('http');

var Hashes = require('jshashes')

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var files = fs.readdirSync(".");
// list the private key
console.log('可选的付款人:name[id]');
files.forEach(function(item) {
    if (path.extname(item) === '.sec'){
		var nor = yaml.safeLoad(fs.readFileSync(path.basename(item,'.sec')+".nor", 'utf8'));
		console.log(path.basename(item,'.sec')+"\t["+nor.id+"]");
	}
});

// list the public key
console.log('可选的收款人:name[id]');
files.forEach(function(item) {
	if (path.extname(item) === '.pub'){
		var nor = yaml.safeLoad(fs.readFileSync(path.basename(item,'.pub')+".nor", 'utf8'));
		console.log(path.basename(item,'.pub')+"\t["+nor.id+"]");
	}
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
				
				rl.question("请输入付款人私钥口令：\n", function(answer) {
					passphrase = answer;
					rl.close();
					
					transfer(payer,payee,amount,passphrase);
				});
			}
		});
	});
});

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
	var payerpubfile = payerid + ".pub";
	var payerseckey = openpgp.key.readArmored(fs.readFileSync(payersecfile,'utf8')).keys[0];
	var payerpubkey = openpgp.key.readArmored(fs.readFileSync(payerpubfile,'utf8')).keys[0];
	
	var payeepubfile = payeeid + ".pub";
	var payeepubkey = openpgp.key.readArmored(fs.readFileSync(payeepubfile,'utf8')).keys[0];
	
	var data = new Object();
	var input = new Object();
	var output = new Object();
	data.jtid = '1c636fec7bdfdcd6bb0a3fe049e160d354fe9806';	// just for debug
	input.id = payerpubkey.primaryKey.fingerprint;
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
	item.hash = new Hashes.SHA512().b64(datastr)
	
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
			postbody.author = payer;
			postbody.log = doc;
			openpgp.signClearMessage(authorseckey,doc).then(function(pgpMessage){
				// success
				
				postbody.sig = pgpMessage;
				logdata = yaml.safeDump(postbody);
				
				console.log(logdata);
				console.log(logdata.length);
				//fs.writeFileSync("logdata.yaml",logdata)
				
				var options = {
				  hostname: config.server.url,
				  port: config.server.port,
				  method: 'POST',
				  headers: {
					'Content-Type': 'application/x-www-form-urlencoded'//,
					//'Content-Length': logdata.length
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

				req.write(logdata);
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