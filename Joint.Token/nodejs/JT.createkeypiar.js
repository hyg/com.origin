var openpgp = require('openpgp');
var fs = require('fs');
var readline = require('readline');

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

			console.log(opt);

			openpgp.generateKeyPair(opt).then(function(key) {
				fs.writeFile(id+".pub",key.publicKeyArmored,function(err){
					if(err) throw err;
					console.log(id+".pub is saved.");
				});
				fs.writeFile(id+".sec",key.privateKeyArmored,function(err){
					if(err) throw err;
					console.log(id+".sec is saved.");
				});
			});

			});
		});
	});
});


// node JT.createkeypiar.js