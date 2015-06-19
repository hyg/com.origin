var openpgp = require('openpgp');
var fs = require('fs');
var readline = require('readline');
var yaml = require('js-yaml');

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var name,id,email,passphrase;

rl.question("请输入姓名：\n", function(answer) {
  name = answer;
  rl.question("请输入id(英文和字母组成)：\n", function(answer) {
	  id = answer;
	  rl.question("请输入Email地址：\n", function(answer) {
		  email = answer;
		  rl.question("请输入私钥保护口令(以后经常使用，请务必记住，但不能告诉任何人。)：\n", function(answer) {
			passphrase = answer;
			rl.close();
			
			var publicKey,privateKey;
			var opt = {numBits: 2048, userId: name + " (" + id + ") <" + email + ">", passphrase: passphrase};

			console.log("正在创建密钥对，需要几十秒时间，请稍候。。。");

			openpgp.generateKeyPair(opt).then(function(key) {
				fs.writeFile(id+".pub",key.publicKeyArmored,function(err){
					if(err) throw err;
					console.log("公钥文件 ",id+".pub 已保存.");
				});
				fs.writeFile(id+".sec",key.privateKeyArmored,function(err){
					if(err) throw err;
					console.log("私钥文件 ",id+".sec 已保存.");
				});
				
				//console.log("fingerprint :",key.key.primaryKey.fingerprint );
				//var time = Date.parse(key.key.primaryKey.created) ;
				//var date = new Date(time*1000);
				//console.log("create time :",date.toUTCString());

				var auto = new Object();
				
				auto.id = key.key.primaryKey.fingerprint;
				auto.keytype = 2;
				auto.pubkey = key.publicKeyArmored;
				auto.createtime = Date.parse(key.key.primaryKey.created);
				auto.remark = "Auto Account Sample";
				
				doc = yaml.safeDump(auto);
				fs.writeFile(id+".auto",doc,function(err){
					if(err) throw err;
					console.log("账户文件 ",id+".auto 已保存.");
				});
			});

			});
		});
	});
});


// node JT.createauto.js