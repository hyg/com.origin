var infra = require('./infra');


var fs = require('fs');
var readline = require('readline');
var yaml = require('js-yaml');

var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));

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
				
				infra.createNor(name,id,email,passphrase);
			});
		});
	});
});
