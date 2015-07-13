##联合提货权
Joint Token

###概述
1. 联合提货权（Joint Token，以下简称**JT**）是P2级别利益共同体（以下简称“**部署者**”）部署的一种记账单位。
2. 符合以下全部条件的利益共同体是联合提货权的**普通使用者**，不符合全部条件的是**有限使用者**：
	* 只使用联合提货权报价
	* 只接受联合提货权购买产品和服务
	* 只发放联合提货权作为报酬
3. **兑换处**是一种自动账户，它提供联合提货权与其它记账单位的兑换，由部署者统一开发。自动账户接受要约，定期公布余额，撮合成功后完成支付。兑换处管理员提供推广和咨询服务，撮合的要约差价作作为其报酬。

###作用
1. 隔离内外价值体系，使各项资源的内部估价独立于外部环境，可以跟随自身发展节奏而调整。
2. 统一利益兑现渠道，减少外币的消耗速度，成员只能通过JT销售获利。
3. 分享成果分担损失，兑换比率随着产品盛衰涨跌，JT持有者的利益随之升降。
4. 提高兑现优先级，成员通过兑换处直接获利，优先级高于其它支出以及股权分红。
5. 降低合作成本。各子共同体互相交易直接在内部完成，不产生外币支付成本以及相关税负。
6. 独立记账，各方无法篡改数据，确保账目安全。
7. 原生交易和分配机制，无需借助外部规则实现数字资产的交易、软件法人的财产。

###技术思路
1. 账目存储：假设全局账目可以安全地读写，设计可以切换具体方案的模块化接口，范例可以yaml格式展示，范例代码可以读写文件方式实现。
	<table>
	<tr><th>方案</th><th>优点</th><th>缺点</th></tr>
	<tr><td>中心服务器</td><td>经过实际验证的成熟方案，无须用户节点在线。</td><td>容易被攻击，有成本。</td></tr>
	<tr><td>数字货币区链块</td><td>经过实际验证的成熟方案</td><td>需要一直有在线节点。“挖矿”有成本。</td></tr>
	<tr><td>docker</td><td>不需要一直有在线节点，借助现成镜像管理功能建立账目，有可能无需“挖矿”。</td><td>最新镜像定位、index服务器中心化、分支合并等问题。</td></tr>
	<tr><td>基于七牛等存储服务商</td><td>不需要一直有在线节点，安全和带宽有专业服务</td><td>需要只增不删的扩展方案，有成本，服务商中细化等问题。</td></tr>
	<tr><td>基于git</td><td>不需要一直有在线节点，明账免费，一定程度上无中心。</td><td>需要只增不删的扩展方案。</td></tr>
	<tr><td>基于DHT</td><td>不需要一直有在线节点，明账免费，无中心。</td><td>需要只增不删的扩展方案，旧数据可能失效。</td></tr>
	</table>
2. 假设任何时期有当时安全的数字签名算法。设计可以切换签名算法的模块化接口，范例以openpgp算法实现数字签名。
3. 增加以算法定义的账户，实现规则已知的交易和分配功能。对应操作的账目不是以数字签名保证其合法性，而是以{算法ID，操作ID，输入条件}来保证其合法性。比如{某利益共同体的主账户ID，年终分配操作ID，2014-12-31 24:00:00}可以定义一组支出账目，任何一方可以运行指定算法验证其合法性，从而决定是否允许这组账目写入存储（实际上是决定是否使用写入后的总账，还是使用其写入前的）。算法定义应能切换不同的编程语言，由于二进制执行文件随操作系统而变化，解释型语言才能保持一致的数字签名，范例以js实现。

###功能
1. 发行
	1. 计划内发行：联合提货权部署者以源代码定义以下机制
		1. 开发基金：支付建模、设计、开发、运维、管理等人员和设备设置费用。
		2. 孵化基金：向普通使用者发放贷款和预购产品。
	2. 计划外发行：以特定卖出价出售任意数额的联合提货权，收入扣除管理费用后全部按特定买入价在兑换处挂单。
		1. 代码模式：由源代码计算出卖出价、买入价、管理费用。
		2. 信托模式：由联合提货权部署者作为委托方，制定管理规则、规定管理费用、选择受托方。由受托方按规则制定卖出价、买入价。其它操作均由软件自动完成。部署者的权利通过密钥和签名实现。
2. 预售/预购/提货/兑现：普通使用者可以提出预售，任何使用者可以预购、提货、兑现。具体规则由部署者制定并实现。
3. 贷款/还款：普通使用者可以申请贷款，孵化基金和其他使用者均可放贷。由软件自动按期还款。
4. 要约/撮合：，JT持有者可以向兑换处提交要约，要约撮合成功后自动支付（transfer的remark中带有要约的hash值），差价作为兑换处管理员的报酬。
5. 导师：普通使用者可以购买辅导服务，辅导者即成为**导师**。导师除了可以按辅导协议收费外，在每次预售开始前提交的预购，拥有优先权。

###账户
1. 普通账户：以公钥（或其经过一组计算后的结果，opepgp类型取数字指纹）作为账户ID。该密钥对用于账户相关数字签名。
	1. Infra yaml文件规则
		* tag: "nor"
		* author: openpgp的Userid中间的id // Userid = "name (id) <email>"
		* data: 账户定义
		* sigtype: 0 
	2. 账户定义数据结构：
		- id: 账户ID。
			- openpgp: fingerprint
		- keytype: 密钥类型。
		- pubkey: 完整的公钥。
		- createtime: 账户创建时间。
		- remark: 备注文本。
	3. yaml范例：
		<pre>
		cod: ''
		tag: nor
		author: huangyg
		data:
		  id: 85834628b7f4e430f017c0fb9f05150213095bf9
		  keytype: 2
		  pubkey: "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js VERSION\r\nComment: http://openpgpjs.org\r\n\r\nxsBNBFWg1XsBB/99kPc8gBW3k0ncfCbK6bR742vTU2VfNR85BscueV5JlQee\n/6mRRSWsh7VIHBOvbf1tBLIKbBmsWM+P96WbRX1iJVbt3FQ8IgawHAPgSCXH\nCLHtpg9E90dnGooUu3P6267Z0MZ3LkNU+Ynqszku+U/NQSHnxH1ouOkWHQWJ\nA40wK8LIxyVwZT/d5NwAeHkbZwfxsaAfViywiyWCh2iUZW4/FaGpXYnyMgKV\nXMniaNqucY6BJtRR3WKrWWUONOh9E9zzzmMMIPPWAdpcb7Hg48nvVh9NeA0t\nM1H+ueOruhhNC7iXRQTrCQ5z6Ydn4bbqdxUCUI4qtaLYmlbE+8D5+4CnABEB\nAAHNKOm7hOWLh+WImiAoaHVhbmd5ZykgPGh1YW5neWdAeHVlbWVuLmNvbT7C\nwHIEEAEIACYFAlWg1YgGCwkIBwMCCRCfBRUCEwlb+QQVCAIKAxYCAQIbAwIe\nAQAAvGoH/3loXBU5wvklsF4ixkCLnRhXYImC/TyV205cIATwWyeh4F//iIFm\nr42AyW2rBXDv6dC/g1tl2Ev/QBVpMUyH6I4qQC2EHQkbJ+70YqZFPFhZvN99\nNJ0CGZEeqUoLf4tGBe86y3v9U5De7inG8Px6TkiyNWbjK3NP6O1EZ80gYh3k\nyB1gIlq1YoZ3atIgQUBdigK2ftxVEE8EZCRMVadx1OdYWqSNyzOBIYQ5kgaM\n3uOvUPvuJIsc3aDImb+zlIjcXPSok8uJ9ffukpbfeM+L2tyvJfwUjXFqBqah\nkLFuA600udpc0uUceM4hB0X1Ct4oNOIhTj48+GiHV/YFAMLhREDOwE0EVaDV\nfgEH/3g+jIoPbzJYAZVHf3PC90c0DZyeXVzgX7aM3j+mAwfamNrGuslvY4qx\n+cCEhc97ppVZ20xCLMsjTOnnrRXb43vgrzs/Z3ekvgMOlffZ/qqgKNZW2qgx\no7bg9vRSh8BXPFQgpt6h3+yYgyrH5CJqAUzwZuivfn+ZqIFp22Oxmw1b582o\n3MhGyDR092qDZZ3Bb9etJg1OjUEqpzjSfdn9K8H3OF44Icqqo4RgV1C8A/df\ncUm5MZuIAO4BDCC/+GPTJh3QjM/QBnZbRigAb6RYPLfQ870YsH9gHHHkOs2k\nX4/dEOa7HGJTMvjq1IJnKzDkx7J3C4B54I2MauzvN+MxDycAEQEAAcLAXwQY\nAQgAEwUCVaDViAkQnwUVAhMJW/kCGwwAAHVoB/9EIltXcds+XnRCThgZFUSs\nf+c9ds+xyZiTis1fxvqY8jv2aTaBSicqZJD5c+lfF7sVsHcf5/kbUw5RfaaL\nS9vE/Ok4O2AZ1GGBw45CDpYaWFF7Zt+yAIAyJpFHjas+u2hVaBcrxWzhj8Pu\nwj52Tba6CZszd56qQebWJ0BdHaWSp08FmiRP9xSYte0ZOoSlUmorPnky1xCC\nkFltV1r972pGHuaD8SjL2+Q7mU8cW+4Crf/Z7Ct+cd46SKJcTV7i0faC4sO2\n9xWb8K/0ODZKhu5KWuzI1jkGhkZ23y6NvzBSJ0FUyW5Cxe2WaSor3JrD/5Cs\n9UWzN0SxC9V5FWjdDG7q\r\n=CCv8\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n"
		  createtime: 1436603771000
		  remark: Normal Account
		sigtype: 0

		</pre>

2. 自动账户：以一组源代码的数字摘要（或其经过一组计算后的结果）作为账户ID。这组源代码定义了所有支出操作，对每种操作定义了激发条件和内部唯一的操作ID。自动账户由利益共同体使用，每次规则升级将产生不同的自动账户。
	1. Infra yaml文件规则
		* cod: 如果术语COD，就写COD的名称
		* tag: "auto"
		* author: 发布者的openpgp的Userid中间的id // Userid = "name (id) <email>"
		* data: 账户定义
		* sigtype: 0 
	2. 账户定义数据结构：
		- id: 账户ID。
		- codetype: 源代码类型。
		- codeurl: 源代码路径。
		- listener：各事件的处理函数。
		- createtime: 账户创建时间。
		- remark: 备注文本。
	2.  yaml范例：
		<pre>
		cod: ITW
		tag: auto
		author: huangyg
		data:
		  id: rorRwGyyGYgU1KK0b6L4Xuvl0lfEj4H7WlgF/o5x8RCkamHcukypcSlY43I6WDWivMvEG6dBiOm7Uza7ugw0pg==
		  codetype: 1
		  codeurl: 'https://raw.githubusercontent.com/hyg/com.origin/11b720423a470ec0fc0affcc63e5f5ca1ee5688a/Joint.Token/client/ITW.auto.js'
		  createtime: 1436695429259
		  remark: ITW.auto
		sigtype: 0
		</pre>
3. 根账户：以一组源代码的数字摘要（或其经过一组计算后的结果）作为账户ID，同时也是这种JT的ID。这组源代码定义了所有发行和销毁操作，对每种操作定义了激发条件和内部唯一的操作ID。根账户由JT使用，每次发行和销毁规则升级将产生不同的根账户，实质上产生新种类的JT。
	1. 账户定义数据结构：
		- id: 账户ID。
		- sourcecodetype: 源代码类型。
			- 1:js
			- 2:lua
		- sourcecodeurl: 源代码路径。
		- buftype: 计划外发行模式
			- 1:code		代码模式
			- 2:trust	信托模式
		- tempissuecodeurl:计划外发行代码。
		- deployerpubkey：部署者公钥，也是计划外发行的委托方公钥。
		- createtime: 账户创建时间。
		- remark: 备注文本。
	2. yaml范例：
		<pre>
			id: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
			sourcecodetype: 1
			sourcecodeurl: raw.githubusercontent.com/hyg/js.sample/master/openpgp/openpgp.min.js
			buftype: 2
			deployerpubkey: |-
			  -----BEGIN PGP PUBLIC KEY BLOCK-----
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
			  -----END PGP PUBLIC KEY BLOCK-----
			createtime: 2015-06-13 21:06:31
			remark: Account Sample
		</pre>

###账目封装Item
1. 用途：统一封装转账、发行、销毁、要约、撮合、分配等账目的数据。
2. 数据结构：
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
3. 范例：
<pre>
	type: 3
	data: |
	  jtid: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
	  input:
	  - id: e98a7202968f6a76aabbf6bc06d40101190f1956d509ddf23f9a01eb028fc0f6
	    amount: 1.05
	  output:
	  - id: 53fd8ea011483ce70a16332d877d6efd5bafb369
	    amount: 1
	  - id: 6f9b6a31cc59036998ee0ab8c11547397dda1944
	    amount: 0.05
	  total: 1.05
	  time: 2015-06-14 17:54:16
	  remark: sample
	hashtype: 1
	hash: aWWEhRTbrHFVMMXb3aalvXi4QPhxEtuSrgEX+wskyTq3+Rp1mPVebgEf9u98+hW456PaZI/Bslb3Cxq55Aq2TQ==
	sigtype: 2
	sig:
	- |-
	  -----BEGIN PGP SIGNATURE-----
	
	  wsBcBAEBCAAQBQJVfU9ICRBOkeAa0J/cugAAKpEIACPBA6vbXLtKial7bLeuWJe7
	  ny7FCYCAKtdu7UYTtjBJ4zw9b/+BrcaxYbXzQ6d+/JuafqI1qyitTEwC6eDYzWWT
	  FPZAhDloWZpiEBAZJCZ7O1bc54ixcHbyuFYFqwpnozh2UjAw3jz/wT8ETK9Er+Tg
	  f0V8tuy2frbOiBPcZZOzU4cAoyb2o/BGwTKmTBWwz55kR74AsUfg8GKcC+AbzLjE
	  hK/bFY51wtOMU2DyCK6Lv30R2f8N76TUIL6NUGjUd2nxqkBCh2wAk/hIvl3mREBI
	  mVqyTgLyczTGb57JDkmtH/Ml+4o9FGRpNKYHVtmBZBwtuu/a01iGRKuCjh92Qso=
	  =teu6
	  -----END PGP SIGNATURE-----
</pre>

###发行Issue
1. 用途：用于发行新JT，表现为只有接收方没有支付方。创建账目者可以获得报酬，但只有符合条件的第一个账目数据会被接受，其余的会被丢弃。
2. 账目数据结构：
	- jtid：JT种类的ID，通常是这种JT的发行和销毁算法源代码的数字摘要。
	- input：空数组，为了和transfer兼容。
	- output：一个数组，包括每一个接收方的账户ID和接收金额。
	- total：发行总金额。
	- time：发行时间。
	- remark：备注。
3. 范例：
<pre>
	jtid: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
	input: []
	output:
	- id: 53fd8ea011483ce70a16332d877d6efd5bafb369
	  amount: 1
	- id: 6f9b6a31cc59036998ee0ab8c11547397dda1944
	  amount: 0.05
	total: 1.05
	time: 2015-06-13 21:42:37
	remark: sample
</pre>

###销毁Destruction
1. 用途：用于销毁JT，表现为只有支付方和酬劳接收方。创建账目者可以获得报酬，但只有符合条件的第一个账目数据会被接受，其余的会被丢弃。
2. 账目数据结构：
	- jtid：JT种类的ID，通常是这种JT的发行和销毁算法源代码的数字摘要。
	- input：一个数组，包括每一个支付方的账户ID和支付金额。
	- output：空数组，为了和transfer兼容。
	- total：销毁总金额。
	- time：发行销毁时间。
	- remark：备注。
3. 范例：
<pre>
	jtid: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
	input:
	- id: 7798bf69af167ae776585cde93ba497f86fa9602c3d94d58420089ab60111f9e
	  amount: 1.05
	output: []
	total: 1.05
	time: 2015-06-13 21:48:29
	remark: sample
</pre>

###转账Transfer
1. 用途：用于存放任何用途的转账，支付方支付总金额等于各接收方收款金额之和。
2. 账目数据结构：
	- jtid：JT种类的ID，通常是这种JT的发行和销毁算法源代码的数字摘要。
	- input：一个数组，包括每一个支付方的账户ID和支付金额。
	- output：一个数组，包括每一个接收方的账户ID和接收金额。
	- total：收支总金额。
	- time：转账时间。
	- remark：备注。
3. 范例一（普通转账）：
	<pre>
		jtid: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
		input:
		- id: 7798bf69af167ae776585cde93ba497f86fa9602c3d94d58420089ab60111f9e
		  amount: 1.05
		output:
		- id: 53fd8ea011483ce70a16332d877d6efd5bafb369
		  amount: 1
		- id: 6f9b6a31cc59036998ee0ab8c11547397dda1944
		  amount: 0.05
		total: 1.05
		time: 2015-06-13 21:38:59
		remark: sample
	</pre>
4. 范例二（要约撮合）
	<pre>
		jtid: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
		input:
		- id: 53fd8ea011483ce70a16332d877d6efd5bafb369
		  a: 1.05
		  m: offerhash:aWWEhRTbrHFVMMXb3aalvXi4QPhxEtuSrgEX+wskyTq3+Rp1mPVebgEf9u98+hW456PaZI/Bslb3Cxq55Aq2TQ==
		output:
		- id: 6f9b6a31cc59036998ee0ab8c11547397dda1944
		  a: 1
		- id: 62babbb806a29f988a4bf0036350665abcab7be0
		  a: 0.05
		total: 1.05
		time: 2015-06-16 11:07:42
		remark: match sample
	</pre>

###要约Offer
1. 用途：
2. 账目数据结构：
	* jtid: 本位币ID
	* type：买卖种类
		* 1:买
		* 2:卖
	* offierorid：要约提出账户ID
	* agentid：交易所账户ID
	* objid：买卖对象ID，外部对象直接用名称，内部记账单位用根账户ID。
	* objunit：买卖对象的单位。
	* price：价格，每个单位的对象价值多少个本位币。
	* jtamount：要约的本位币总额。
	* objamount：要约的买卖对象总单位。
	- time：要约时间。
	- remark：备注。
3. 范例：
<pre>
	jtid: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
	type: 1
	offerorid: e98a7202968f6a76aabbf6bc06d40101190f1956d509ddf23f9a01eb028fc0f6
	agentid: 53fd8ea011483ce70a16332d877d6efd5bafb369
	objid: RMB
	objunit: yuan
	price: 1.05
	jtamount: 105
	objamount: 100
	time: 2015-06-15 19:52:48
	remark: offer sample
</pre>

###交易Exchange
1. 用途：用于交换，目前是不同JT之间的兑换，该数据会写入两种JT的账目存储。今后逐步扩展其它软件可以自动处理的数字资产交易。
2. 账目数据结构：
	> {"data":{"data1":{"JTID":"xxxx","Type":"Exchange","Sender":"yyyy","Receiver":["ID":"zzzz","Amount":aaa.bb],"Time":"yyyy-mm-dd hh-mm-ss"},"data2":{"JTID":"xxxx","Type":"Exchange","Sender":"yyyy","Receiver":["ID":"zzzz","Amount":aaa.bb],"Time":"yyyy-mm-dd hh-mm-ss"}},"sig1":"ssss","sig2":"ssss"}
3. 数据说明
	- xxxx：JT种类的ID。这里有两种JT，各有不同的ID。
	- yyyy：支付方的账户ID。每种JT有一个支付方。
	- zzzz：接收方的账户ID。每种JT有一个或多个接收方。
	- aa.bb：每个接收方的收款金额。
	- yyyy-mm-dd hh-mm-ss：交易时间。data1和data2应该相同。
	- ssss：data的数字签名。交易双方的支付者应该向对方提供数字签名。

###分配Alloc
1. 用途：用于利益共同体支付报酬、分配利润等操作。创建账目者可以获得报酬，但只有符合条件的第一个账目数据会被接受，其余的会被丢弃。
2. 账目数据结构：
	> {data:{"JTID":"xxxx","Sender":"yyyy","Type":"Alloc","Param":"pppp","Receiver":["ID":"zzzz","Amount":aaa.bb],Time":"yyyy-mm-dd hh-mm-ss"}}
3. 数据说明
	- xxxx：JT种类的ID，通常是这种JT的发行和销毁算法源代码的数字摘要。
	- yyyy：自动账户的ID，通常是某个利益共同体的分配源代码的数字摘要。
	- pppp：分配算法的参数。其中应包括酬劳接收者的ID和金额，算法会检查是否合法。
	- zzzz：接收方的账户ID。包括领取酬劳者的ID。
	- aa.bb：收款金额。总和就是分配金额。
	- yyyy-mm-dd hh-mm-ss：分配时间。