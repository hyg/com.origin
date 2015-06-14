// yaml project main.go
package main

import (
	"bytes"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/base64"
	"encoding/hex"
	"golang.org/x/crypto/openpgp"
	"gopkg.in/yaml.v2"
	"log"
	"os"
	"time"
)

var pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v0.9.0
Comment: http://openpgpjs.org

xsBNBFSnY2kBCAC0335GMdWZmlseWpNlIwi7yc43dtT0V0yigb3pbd1vdVxY
W/vdh0dzDADx/IyVgO699hp/Cno9Tuu/Hc3ohidHvUjkYMDOK0PLv+tCD7Qu
RuPkb6FaJSiUEPzW/BgYuhiJD7AWX8nQpXZAvOKs78Ky/6dL1GlZ2pn0OJMo
RA9XWUZrebHrxzKILwJTAjaAlvdlMcsu95cem5ZNHU9mK2oANTiPONSeojNh
kRpGxVMGaWiFn/lFnk8y1CkVrmGp43xbIoIT2bl/o5bVkv1QSjcX0TeefBZv
cz+FrluJG/MzJzjGtucAPgCijOK0yPv46vXqN6h/oIui0iNcXDru9jc9ABEB
AAHNMem7hOWLh+WImiAoaHVhbmd5Z0BJVFcgb25seSkgPGh1YW5neWdAeHVl
bWVuLmNvbT7CwHIEEAEIACYFAlSnY2sGCwkIBwMCCRBOkeAa0J/cugQVCAIK
AxYCAQIbAwIeAQAAPQEH/2hTG+EYBWbSoHMwqfYl/NhNbfj8IVgMahsp577x
Na5TvDqQGVeuYeLg+iTjXbyh/iOf2JP0Fv/EgwpLuIC5foJM8+fVAsLEJ/jo
X75o4WQacTcwFFwdgDd1gFBF0alfbz8XORqsvM3nojounnRvYDoJwuwSiQOe
r+4I7ehotHAjwKratzdE10IuQIlGEMne3U3yu38okzPcUswQ2QKm5LIk/fm8
1SvN8FlOd89BhfJGY801WibfnbiOxayFkR1c6XaxgRbZhBvLGsU7v7Y4Ni/S
cxYYhE7dWJkDalIABJ75Wtpl4qUj0OxIgvs3mqvpDeCcr2BCS+UnFu1/vOpY
NWfOwE0EVKdjaQEIAPVuxvdrJi4NReMfr4jD4fk2fe8yW5AP+JqZlQesPW7D
zmVxpLokn3XstaeVH6UnF17u9+ktsVBVQ8vefLzZGmv2k8f6S28W+eAFuok9
fILaFdWuj2900SI9KuXTEKCgQ5qrEPlDTuWwn2G7eAHYOQOBm02p4SVQHquc
OZGoMkeIXv+k7nypS06U343z6zHlah64RlgjOQab8xEHyAi3b3DEo9j6vUwC
lWHdkjRCw8Cywwgzyez+fQuubw2JEolMjW/rV8MncMOuFJcFZddGooc0qtIH
mK852JWoNYpgKlqiZJdDjMvjGSjNEoI/ozAs+4YJdvaMzYLwEsHbOKOXexkA
EQEAAcLAXwQYAQgAEwUCVKdjbAkQTpHgGtCf3LoCGwwAAL5sB/sER+mFuUe9
fQSwSWe3MG7UizNzXhCKwn+rpOwzZOk1cbYFLCaSjok5syQya/QI7EoW0qwG
i1hie8XJEN4LFGpHBg4q2vyhN1Biye//peK2c4oYuWkocQL4vztrjnwcFFRq
ptOcS9swHRIb9UV+asy0w59JJcsIzPry/pyZ15SYpl3GFTiMKUx1k2wOTISI
Kk/LBkPnIy4rD5D3nw0mtHObQa8e9UhFkdnl5YK2hvQBI36FMu9Uc5TlComJ
h5QFXfe/zb9hpyvijz6hHjMkT8Ib9t9wvCN8HX1kTsWpyZoZmKSHlTJq1QhD
CFCd8czWD6gsLigm4J0v6+W+ghlM4yxB
=ZSZT
-----END PGP PUBLIC KEY BLOCK-----`

type NormalAccount struct {
	ID         string
	KeyType    int
	Pubkey     string
	CreateTime string
	Remark     string
}

const (
	rsa = 1 + iota
	pgp
)

type AutoAccount struct {
	ID         string
	CodeType   int
	CodeUrl    string
	CreateTime string
	Remark     string
}

const (
	js = 1 + iota
	lua
)

type RootAccount struct {
	ID             string
	SourceCodeType int
	SourceCodeUrl  string
	BufType        int
	DeployerPubkey string
	CreateTime     string
	Remark         string
}

const (
	code = 1 + iota
	trust
)

type Amount struct {
	ID     string
	Amount float64
}

type Transfer struct {
	JTID   string
	Input  []Amount
	Output []Amount
	Total  float64
	Time   string
	Remark string
}

type Offer struct {
	JTID string
}

type Match struct {
}

type Item struct {
	Type     int
	Data     string
	HashType int
	Hash     string
	SigType  int
	Sig      []string
}

const (
	issue = 1 + iota
	destroy
	transfer
	offer
	match
	alloc
)

const (
	SecureHashAlgorithm512 = 1 + iota
	SecureHashAlgorithm256
)

func main() {
	log.Printf("--- Item:\n%s\n\n", MakeItem())
}

func MakeNormalAccount() string {
	hash := sha256.New()
	hash.Write([]byte(pubkey))
	md := hash.Sum(nil)
	mdStr := hex.EncodeToString(md)

	na := NormalAccount{mdStr, pgp, pubkey, time.Now().Format("2006-01-02 15:04:05"), "Account Sample"}

	d, _ := yaml.Marshal(&na)

	return string(d)
}

func MakeAutoAccount() string {
	mdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"

	aa := AutoAccount{mdStr, js, "raw.githubusercontent.com/hyg/js.sample/master/openpgp/openpgp.min.js", time.Now().Format("2006-01-02 15:04:05"), "Account Sample"}

	d, _ := yaml.Marshal(&aa)
	return string(d)
}

func MakeRootAccount() string {
	mdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"

	ra := RootAccount{mdStr, js, "raw.githubusercontent.com/hyg/js.sample/master/openpgp/openpgp.min.js", trust, pubkey, time.Now().Format("2006-01-02 15:04:05"), "Account Sample"}

	d, _ := yaml.Marshal(&ra)
	return string(d)
}

func MakeTransfer() string {
	JTmdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"
	hash := sha256.New()
	hash.Write([]byte(pubkey))
	md := hash.Sum(nil)
	NmdStr := hex.EncodeToString(md)
	Amdstr1 := "53fd8ea011483ce70a16332d877d6efd5bafb369"
	Amdstr2 := "6f9b6a31cc59036998ee0ab8c11547397dda1944"

	tf := Transfer{JTmdStr, []Amount{Amount{NmdStr, 1.05}}, []Amount{Amount{Amdstr1, 1.0}, Amount{Amdstr2, 0.05}}, 1.05, time.Now().Format("2006-01-02 15:04:05"), "sample"}
	d, _ := yaml.Marshal(&tf)
	return string(d)
}

func MakeIssue() string {
	JTmdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"
	//hash := sha256.New()
	//hash.Write([]byte(pubkey))
	//md := hash.Sum(nil)
	//NmdStr := hex.EncodeToString(md)
	Amdstr1 := "53fd8ea011483ce70a16332d877d6efd5bafb369"
	Amdstr2 := "6f9b6a31cc59036998ee0ab8c11547397dda1944"

	tf := Transfer{JTmdStr, []Amount{}, []Amount{Amount{Amdstr1, 1.0}, Amount{Amdstr2, 0.05}}, 1.05, time.Now().Format("2006-01-02 15:04:05"), "sample"}
	d, _ := yaml.Marshal(&tf)
	return string(d)
}

func MakeDestroy() string {
	JTmdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"
	hash := sha256.New()
	hash.Write([]byte(pubkey))
	md := hash.Sum(nil)
	NmdStr := hex.EncodeToString(md)
	//Amdstr1 := "53fd8ea011483ce70a16332d877d6efd5bafb369"
	//Amdstr2 := "6f9b6a31cc59036998ee0ab8c11547397dda1944"

	tf := Transfer{JTmdStr, []Amount{Amount{NmdStr, 1.05}}, []Amount{}, 1.05, time.Now().Format("2006-01-02 15:04:05"), "sample"}
	d, _ := yaml.Marshal(&tf)
	return string(d)
}

func MakeItem() string {
	trstr := MakeTransfer()
	signed := Sign(trstr)

	sum := sha512.Sum512([]byte(trstr))
	buf := sum[:]
	hash := base64.StdEncoding.EncodeToString(buf)

	item := Item{transfer, trstr, SecureHashAlgorithm512, hash, pgp, []string{signed}}
	d, _ := yaml.Marshal(&item)
	return string(d)
}

func Sign(plaintext string) string {
	secringFile, _ := os.Open("C:/Users/huangyg/Desktop/huangyg.sec")
	defer secringFile.Close()
	secring, _ := openpgp.ReadArmoredKeyRing(secringFile)
	myPrivateKey := getKeyByEmail(secring, "huangyg@xuemen.com")

	myPrivateKey.PrivateKey.Decrypt([]byte("passphrase"))

	ret := ""
	buf := bytes.NewBufferString(ret)
	openpgp.ArmoredDetachSignText(buf, myPrivateKey, bytes.NewBufferString(plaintext), nil)
	ret = buf.String()

	return ret
}

func getKeyByEmail(keyring openpgp.EntityList, email string) *openpgp.Entity {
	for _, entity := range keyring {
		for _, ident := range entity.Identities {
			if ident.UserId.Email == email {
				return entity
			}
		}
	}

	return nil
}
