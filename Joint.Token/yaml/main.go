// yaml project main.go
package main

import (
	"crypto/sha256"
	"encoding/hex"
	"gopkg.in/yaml.v2"
	"log"
	"time"
)

var pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v0.9.0
Comment: http://openpgpjs.org

xsBNBFSlVgcBCACQURxJMfdrPbAFa5ZGOs4j43tRmc7KQoM6lKveobO+v+Jg
IIYqXtDadXAM1h34CQgwj4o7VFKf+M1SmGbO57cx+M3U1+SgKmW9w8gRwgNE
q+m3JPo+HIiOI/X8Gsa9vrbAbs19UvXk4H+CdC02bxwruLPan87fI17wGLEB
62mcLG9eNPg4XrmZDDISPvicR88AFmkZMPh9WoVm99jzKl3EWCfPXqdNiLWK
kzXZO2jPLXLb2iJRacq2i+QXt5UWB5BEaAHLLVLTu5PNykHumN0xxIoidrxV
G+ug8Z269ZmcYdRv2fgY/TYP+/h43RkSI+iqiXeKSL8+WGDqSpee9sPnABEB
AAHNMOa1i+ivlei0puWPtyAoaHlnL2pzLnNhbXBsZSkgPHRlc3RAanNzYW1w
bGUub3JnPsLAcgQQAQgAJgUCVKVWDwYLCQgHAwIJEE5QeumSjbLwBBUIAgoD
FgIBAhsDAh4BAADijgf/e24fcRYoEZlIrej5ZblOszkKV7Y2900NerwrLPFK
kfQVHOBSAi9Nls5rOlZ4jDi7rd8/V+NUDDqE966jMha6TpCnHd+j6I4tiJiq
I8n51FoctVcpJcadygcoZE18pGF+dl62o7iLJVqsQv6ZnbLTQJngPDjAQGG8
KKhJjpY2RYNnR8vBCb4+lH8lhBnXviUUyyFRBjbBdhiPVebvv/LGd60diEmJ
+xKC89+Z0bGdElPpVW2WdOkTXL47UoNfZpHzpxhytOmjAykxGFtaqtUmHzvN
KogM5YDXuO7ZcWjiiTbKSnLcYyWLBp8VGq+MdDQmIEV7YpE3/mWPHat0wZar
X87ATQRUpVYMAQgAogdxHIK2i4MMeV2DASacwP037GCqyLHRcmo1ud5IYkHd
WXs1xigEklj2+3AaWjYgHzhN/f5BE2aDFttSonJhQ+ltZrEArungIWppSfN+
v6SyzmUsYK8EooF1M/EckvyF3ugub+SGst4MXyGfYhx901oRvKhY61pFWgZP
3gs/P1nHbDpUYNDKENflVBV0ha2DSlLxFQdfSh4hh4Jm1icmw85V5gTwppQd
CQ//qGZ757Tq4AtZS9givMYnSkXFsSlufKZ8LTVa/RFZ+gGKbcJHMR8XLoOc
8n8Vge92GHm63W5mP33A99e+NgyegInLmoi3lIXGO8yORIdwci17Eaqa9QAR
AQABwsBfBBgBCAATBQJUpVYQCRBOUHrpko2y8AIbDAAAmiAIAIHhfGiJ9e9L
n8z9tD/BFzqk5vll36hCXkLdg2HzftJsxPdW0eT27iDLagJcsrbVpRAag49/
47GH9BeHdtqsDNsh7UzQAlfp4t7+Fi00+9GuazHtTnI1bN9zgpGLCCNP6JUR
J9Z00c+GhQayTkPwTCf9zCidtbbNJc7GRlfgOMaoNqGoasyZrltqoB6hCM16
l0jkh59MIqQ+4FbLQOqr/7SGi6H1wzFa/Q4Q9R2VDg5zlEg163pbsf+ope52
3rPxBia7vxpFfXQXGbtR6vZDjI8uqsEMEyflqiuHJxmjtitnYLRqxQRr9fZq
WMc+ZlpNrplXO9WkeuhEICGQdZSy/ok=
=+yKz
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
	openpgp
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

func main() {
	MakeDestroy()
}

func MakeNormalAccount() {
	hash := sha256.New()
	hash.Write([]byte(pubkey))
	md := hash.Sum(nil)
	mdStr := hex.EncodeToString(md)

	na := NormalAccount{mdStr, openpgp, pubkey, time.Now().Format("2006-01-02 15:04:05"), "Account Sample"}

	d, _ := yaml.Marshal(&na)
	log.Printf("--- NormalAccount:\n%s\n\n", string(d))
}

func MakeAutoAccount() {
	mdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"

	aa := AutoAccount{mdStr, js, "raw.githubusercontent.com/hyg/js.sample/master/openpgp/openpgp.min.js", time.Now().Format("2006-01-02 15:04:05"), "Account Sample"}

	d, _ := yaml.Marshal(&aa)
	log.Printf("--- AutoAccount:\n%s\n\n", string(d))
}

func MakeRootAccount() {
	mdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"

	ra := RootAccount{mdStr, js, "raw.githubusercontent.com/hyg/js.sample/master/openpgp/openpgp.min.js", trust, pubkey, time.Now().Format("2006-01-02 15:04:05"), "Account Sample"}

	d, _ := yaml.Marshal(&ra)
	log.Printf("--- RootAccount:\n%s\n\n", string(d))
}

func MakeTransfer() {
	JTmdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"
	hash := sha256.New()
	hash.Write([]byte(pubkey))
	md := hash.Sum(nil)
	NmdStr := hex.EncodeToString(md)
	Amdstr1 := "53fd8ea011483ce70a16332d877d6efd5bafb369"
	Amdstr2 := "6f9b6a31cc59036998ee0ab8c11547397dda1944"

	tf := Transfer{JTmdStr, []Amount{Amount{NmdStr, 1.05}}, []Amount{Amount{Amdstr1, 1.0}, Amount{Amdstr2, 0.05}}, 1.05, time.Now().Format("2006-01-02 15:04:05"), "sample"}
	d, _ := yaml.Marshal(&tf)
	log.Printf("--- Transfer:\n%s\n\n", string(d))
}

func MakeIssue() {
	JTmdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"
	//hash := sha256.New()
	//hash.Write([]byte(pubkey))
	//md := hash.Sum(nil)
	//NmdStr := hex.EncodeToString(md)
	Amdstr1 := "53fd8ea011483ce70a16332d877d6efd5bafb369"
	Amdstr2 := "6f9b6a31cc59036998ee0ab8c11547397dda1944"

	tf := Transfer{JTmdStr, []Amount{}, []Amount{Amount{Amdstr1, 1.0}, Amount{Amdstr2, 0.05}}, 1.05, time.Now().Format("2006-01-02 15:04:05"), "sample"}
	d, _ := yaml.Marshal(&tf)
	log.Printf("--- Issue:\n%s\n\n", string(d))
}

func MakeDestroy() {
	JTmdStr := "1c636fec7bdfdcd6bb0a3fe049e160d354fe9806"
	hash := sha256.New()
	hash.Write([]byte(pubkey))
	md := hash.Sum(nil)
	NmdStr := hex.EncodeToString(md)
	//Amdstr1 := "53fd8ea011483ce70a16332d877d6efd5bafb369"
	//Amdstr2 := "6f9b6a31cc59036998ee0ab8c11547397dda1944"

	tf := Transfer{JTmdStr, []Amount{Amount{NmdStr, 1.05}}, []Amount{}, 1.05, time.Now().Format("2006-01-02 15:04:05"), "sample"}
	d, _ := yaml.Marshal(&tf)
	log.Printf("--- Destroy:\n%s\n\n", string(d))
}
