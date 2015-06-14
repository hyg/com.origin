##联合提货权
Joint Token

###概述
1. 联合提货权（Joint Token，以下简称**JT**）是P2级别利益共同体（以下简称“**部署者**”）部署的一种记账单位。
2. 符合以下全部条件的利益共同体是联合提货权的**普通使用者**，不符合全部条件的是**有限使用者**：
	* 只使用联合提货权报价
	* 只接受联合提货权购买产品和服务
	* 只发放联合提货权作为报酬
3. **兑换处**提供联合提货权与其它记账单位的兑换，由部署者统一管理。各方遵守统一的兑换规则。

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
4. 导师：普通使用者可以购买辅导服务，辅导者即成为**导师**。导师除了可以按辅导协议收费外，在每次预售开始前提交的预购，拥有优先权。

###账户
1. 普通账户：以公钥（或其经过一组计算后的结果）作为账户ID。该密钥对用于账户相关数字签名。
	1. 账户定义数据结构：
		- id: 账户ID。
		- keytype: 密钥类型。
			- 1:rsa
			- 2:openpgp
		- pubkey: 完整的公钥。
		- createtime: 账户创建时间。
		- remark: 备注文本。
	2. yaml范例：
		<pre>
		id: 7798bf69af167ae776585cde93ba497f86fa9602c3d94d58420089ab60111f9e
		keytype: 2
		pubkey: |-
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
		createtime: 2015-05-30 15:16:37
		remark: Account Sample
		</pre>
2. 自动账户：以一组源代码的数字摘要（或其经过一组计算后的结果）作为账户ID。这组源代码定义了所有支出操作，对每种操作定义了激发条件和内部唯一的操作ID。自动账户由利益共同体使用，每次规则升级将产生不同的自动账户。
	1. 账户定义数据结构：
		- id: 账户ID。
		- codetype: 源代码类型。
			- 1:js
			- 2:lua
		- codeurl: 源代码路径。
		- createtime: 账户创建时间。
		- remark: 备注文本。
	2.  yaml范例：
		<pre>
			id: 1c636fec7bdfdcd6bb0a3fe049e160d354fe9806
			codetype: 1
			codeurl: raw.githubusercontent.com/hyg/js.sample/master/openpgp/openpgp.min.js
			createtime: 2015-05-30 16:07:43
			remark: Account Sample
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
	  time: 2015-06-14 16:13:10
	  remark: sample
	sig:
	- |-
	  -----BEGIN PGP SIGNATURE-----
	
	  wsBcBAEBCAAQBQJVfTacCRBOkeAa0J/cugAA6YIIAAL7e9wVlxZl72ngdLWG/3Ek
	  atUAGED95O8RPvYw0AqjiXVqTB2U2xUti5GI8bdMnGRx+Fum7K659hvSx9Y2DAbh
	  +2Mt0TjTbTrMBC8ixf9cqX3YG0su0Msr7MKa9kSTvrF3XYVBmNSXpFIvZNU1y25R
	  GkxXydpjMvyeiqUEGxXVSB6tnRm3Z5v4yu5H4JIYk93pclHUR9GWurIsYyIQO4U0
	  0R+fca/Dc7tz9/YGk1JSvdoY2OjApv66VFBpnrkwoKwdiXQFEIvGFqvp44LKHRdL
	  BA7TAtJgAz6WVRZRQZO8yRE5jPmdDa8C8bEa+uM4Tw9SS1z6RzGFxvu56uWAt1g=
	  =RwtD
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
3. 范例：
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

###要约Offer
1. 用途：
2. 账目数据结构：
3. 数据说明：

###撮合Match
1. 用途：
2. 账目数据结构：
3. 数据说明：

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