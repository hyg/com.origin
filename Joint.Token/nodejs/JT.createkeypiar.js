var openpgp = require('openpgp');
var fs = require('fs');

var name = process.argv[2];
var id = process.argv[3];
var email = process.argv[4];
var passphrase = process.argv[5];

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

// node JT.createkeypiar.js 黄勇刚 huangyg huangyg@xuemen.com password