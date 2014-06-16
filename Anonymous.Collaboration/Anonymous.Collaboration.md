##匿名协作框架
无中心设计


###cod部署
1. 无中心的cod部署方案，具体体现为一系列的cod node（以下简称node）。各node的差异只有ini配置文件，执行文件是相同的（至少API是兼容的）。
2. 部署者根据com设计开发软件，把建模者的rsa公钥写入com.ini文件，把自己的rsa公钥写入cod.ini文件。
3. 建模者部署的cod node，如果node使用新创建的rsa密钥对，则其它node无法识别它的用户是部署者本人。如果node导入部署者rsa密钥对，则意味着公开身份。
4. 如果com设计中为部署者保留了专有职权，虽然技术上可以隐藏部署者node，但事实上cod还是有中心角色的。

###node部署
1. node部署包内容包括：
    1. 一些执行文件，包括node部署脚本。
    2. 一个建模者配置文件com.ini
    3. 一个部署者配置文件cod.ini
    4. 一个node配置文件范例node.ini
    5. 一个部署指南文件。
2. 部署者获得部署包的torrent infohash后可以下载，解压缩后阅读部署指南，修改node.ini然后执行对应的node部署脚本，即可创建一个cod node。
3. 每个node拥有自己的rsa密钥对，可以在部署时导入或者创建。
4. node id根据rsa公钥生成，生成方式应保证同一套rsa密钥对导入不同cod的node，产生的node id不同。

###node发现
1. node包括dht模块，负责node之间的自动发现。
2. dht模块会自动发布部署包、com.ini、cod.ini三个文件的torrent infohash，常年提供P2P下载。
3. dht模块通过dht协议（BEP5）查找部署包和com.ini、cod.ini文件。由于三个infohash不会很接近，因此同时提供的dht node很可能也是cod node。这样就是实现了无中心的自动发现，然后cod node之间即可通过RESTful cod API交互。

###node升级
TBD

###coin
1. node包括coin模块。
2. coin模块管理codcoin和timecoin。
3. codcoin是cod发行的内部记账单位，通常以cod的产品作为抵押。抵押物应该只限codcoin购买，具体抵押规则应公布。
	1. 以实物产品作为抵押的，流通总额不应超过实际库存。
	2. 以人工服务作为抵押的，流通总额不应超过结算周期内的对应人力供给。
	3. 以自动服务作为抵押的，流通总额不应超过结算周期内的服务器负荷能力。
4. timecoin是用户发行的个人记账单位，以个人时间作为抵押，以时间为单位。所抵押的时间应该只限timecoin兑换。
5. 由于数据结构是公开的，rsa密钥对可以导入导出（coin模块也可以开源），因此其它软件也可以实现coin模块的功能。
 
####timecoin
1. 每个node均可发行timecoin。
2. timecoin的数据结构主要内容：
	- timecoin tag：标识这是一个timecoin。
	- timecoin id：全局唯一编号。
	- pour id：铸币记录编号。
	- issuer node id：发行者编号，他要承诺以个人时间兑换自己发行的timecoin。
	- holder node id：持有者编号。
	- amount：面值。一个无符号整数，单位为秒。
	- pourer sig：铸币者数字签名（对timecoin其它数据的数字签名）
3. 铸币（pour），包括发行和重铸、行使，每个铸币记录包括以下主要内容：
	- pour id：全局唯一编号。
	- pourer id：铸币者编号。
	- pour time：铸币时间。
	- input：
		- time：单位为秒的正整数。只有发行者自己可以设置这个字段，表示他承诺交给持有者的时间。
		- count：被融化的timecoin数量。
		- []timecoin：一系列timecoin，必须是未融化过的有效timecoin，而且holder必须是pourer本人。
	- output：
		- begintime：开始行使时间。
		- endtime：结束行使时间。
        - count：铸造的timecoin数量。
        - []timecoin：一系列timecoin，铸币者pourer要做数字签名。
    - pourer sig：铸币者数字签名（对pour其它数据的数字签名）
4. 合法性：合法的铸币记录必须符合以下条件
	1. 铸造的新币和消耗的旧币必须是同一种timecoin（即同一个发行者issuer）。
	2. 所有旧币在铸币之前是有效的，即此前没有出现在任何铸币记录的消耗部分。
	3. 所有旧币的持有者是铸币者。
		> input.timecoin.holder = pourer
	4. 只有铸币者是发行者时才可以投入时间
		>input.time != null
	5. [铸造的新币总额 + 行使时间] = [销毁的旧币总额 + 投入的时间]。其中：行使时间 = (endtime - begintime) .
		>[sum(output.timecoin.amount) + (endtime - begintime)] = [sum(input.timecoin.amount)  + input.time]
5. 发行：发行者投入时间，铸造出一批timecoin即为发行。
	- input.time > 0
	- output.timecoin.issuer = output.timecoin.pourer = pour.pourer
	- output.begintime = output.endtime = null
	- output.timecoin.holder通常是其他人。

6. 行使：timecoin持有者占用发行者时间，消耗timecoin。
	- input.time = null
	- output.begintime != null
	- output.endtime != null
	- output.timecoin.amount 是行使后的余额，holder还是原持有者。

7. 转让：timecoin持有者把timecoin转给其他用户。
	- output.begintime = output.endtime = null
	- 其中一部分output.timecoin.holder 是接收者，余额holder还是原持有者。
	> 比如某乙持有某甲发行的timecoin两枚，面值分别是10和80。他要转让85给某丙，即output两枚timecoin，面值分别为85和5。其中面值85的持有人是某丙，面值为5的持有人还是某乙。

###codcoin
1. 每一个cod钱包软件拥有独立的cod id和rsa密钥对，均可发行自己的codcoin。
2. 每一份codcoin包括以下主要数据：
    - codcoin id。全局唯一编号。
    - 铸币记录id。（这枚codcoin的来源）
    - 发行者cod id。
    - 拥有者cod id。（通常是支付给其它cod的。）
    - 金额大小。一个无符号整数。
    - 铸币者数字签名。（对以上数据的数字签名。）
3. 铸币：包括发行和重铸、销毁，每个铸币记录包括以下主要内容：
    1. 销毁旧币：
        1. 旧币数量
        2. 被销毁的旧币。
    2. 铸造新币：
        1. 新币数量
        2. 铸造的新币，铸币者cod用自己的rsa密钥制作铸币者数字签名。
    3. 铸币者数字签名。（对以上数据的数字签名。）
4. 发行操作：发行者cod可以直接发行codcoin，即铸币记录中的销毁旧币数据为空。使用发行者cod的rsa密钥制作铸币者数字签名。
5. 重铸操作：非发行者cod可以重铸codcoin，合格的重铸必须符合以下条件：
	1. 新币、旧币必须是同一种codcoin（同一个发行者）。
	2. 所有旧币在重铸之前是有效的，即此前没有出现在任何铸币记录的销毁旧币部分。
	3. 所有旧币的拥有者是铸币者。
	4. 铸造的新币总额必须等于销毁的旧币总额。
6. 销毁操作：任何拥有者都可以销毁codcoin，即铸币记录中的铸造新币数据为空。
7. codcoin支付过程即支付者铸币，把接收者cod id写入产生的新币拥有者字段。当铸币记录进入汇总后，支付即完成。
8. 所有铸币记录汇总后，每个codcoin钱包都同步保存。（如何防止分支，有待细化。）

###交易
1. 部署者可以登记自己所拥有的资源种类，包括：
    - 资金：各种传统货币、codcoin
    - 时间：部署者可以制定预算周期，发布调度计划，由软件自动登记、自动扣除。
    - 信息资产
2. 交易：
    1. 邀约：一名部署者可以发布交易邀约，主要数据有
        - 邀约id
        - 支付资源种类
        - 收入资源种类
        - 兑换比率
        - 支付资源余量
        - 最小交易数额
        - 数字签名
    2. 接受：另一名部署者可以接受邀约，主要数据有：
        - 交易id
        - 邀约id
        - 交易数量（以邀约者支付资源计算）
        - 数字签名
    3. 成交：软件可以完成的交易（比如两种codcoin兑换）立即成交，其它交易会两份产生支付记录，主要数据有：
        - 交易id
        - 资源种类
        - 交易数额
        - 支付者
        - 接收者
        - 接收者数字签名
3. 所有邀约、接受、支付记录全部汇总，每个cod同步保存。
4. 失约：
    1. 出现合法的邀约、接受记录，而双方的支付记录都没有数字签名，邀约者失约。
    2. 出现合法的邀约、接受记录，只有一方支付记录有接收者数字签名，未完成支付一方记失约。
5. 一个codcoin发行者，应该保持接受自己发行的codcoin的交易邀约（比如用个人时间兑换codcoin），并坚持兑现交易以保持codcoin的价值。