#语言门
##langs

###概述
1. langs是学习编程的匿名互助网络。建模者、部署者均为北京学门科技有限公司。它的com设计参考了Anonymous.Collaboration模型。
2. 用户要下载langs部署包并安装，成为一个langs节点。每个节点要向建模者缴纳服务费，向部署者缴纳管理费。
3. 每个用户同时具有教学者、学习者角色。作为教学者提供服务，作为学习者购买教学服务。
4. langs内部采用timecoin记账，服务费、管理费、教学服务均使用timecoin支付。用户可以用人民币购买timecoin。

###timecoin
1. 每个用户可以承诺投入时间，通过langs节点发行timecoin。
2. 每个用户的timecoin是互相独立的币种。各种timecoin之间可以兑换，也可以与人民币兑换。
3. timecoin持有者可以向发行者提取时间，发行者应在指定时间内提供教学服务。服务记录将公示，影响币值。
4. timecoin数据结构：
	- timecoin id
	- pour id
	- issuer id
	- holder id
	- begintime
	- endtime
	- issuer sig 
5. pour数据结构：
	- pour id
	- input
		- old coin num
			- []timecoin
		- time
			- begintime
			- endtime
	- output
		- new coin num
			- []timecoin
		- service
	- pourer sig
6. 