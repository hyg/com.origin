##1609
共同体模型

###角色清单
* 建模者 modeler
* 部署者 deployer
* 决策者 director
* 监察者 supervisor
* 管理员 admin
* 任务承担者 worker
* 受托者 trustee

###资产清单
* 记账单位
	* 法币
	* 待兑现利益 RIU：Recorded Interest Unit
* 共同体模型
* 部署方案：
	* p%
	* director、supervisor人数及任期
	* 所使用的法律及需要的其它信息
* 工作计划（含预算）
* 工作报告（含决算）
* 审议报告
* 
###接口清单
* 建模
* 部署
* 任免
* 决策
* 监察
* 计划与预算
* 执行
* 改进

###协作过程
* 建模
	* 初版发布后，建模者根据反馈安排升级。

* 部署
	* 设立共同体则成为首任部署者，部署者担任首届director，任命supervisor、admin。
	* 部署者可以指定继任者，如果没有指定又不能工作，则由director、trustee按改进选项规则选举部署者。
	* 部署者根据共同体模型设计部署方案。
	* 建模者审议部署方案，提交报告。
	* 如果共同体模型和部署方案修改了利益分配“待兑现利益”一节，director、turstee全体批准方才可以部署。如未改动，director全体批准即可部署。

* 任免
	* 选举由部署者组织。
	* director、supervisor由worker、RIU持有者选举。假设worker合同的报酬RIU总额为w，RIU总额为r，席位为x，worker手中合同的每个RIU报酬权重为r*x*p，RIU持有者持有的每个RIU权重为w*x*(100-p)。选举采用累积投票制，不对单独席位进行罢免投票，每次都全部重选。
	* trustee由RIU持有者任免，以持有的RIU为权重。
	* admin由director任免，一人一票。
	* 有条件时应实现连续选举：选举人随时变更自己选票，随时根据统计结果实施任免。

* 监察
	* supervisor、trustee均有权监察工作记录。
	* 如有失职、违规，可发起罢免或重选。

* 计划与预算
	* director发布工作计划
	* trustee确定预算透支限额，拨付等额RIU供并入预算
	* 如需拨付的RIU超过trustee手中持有量，可以发行新RIU。

* 执行 
	* director制定worker合同，admin组织招募签署。
	* 需要时，director授权admin签发通用工单、通用合同。
	* worker签署合同后需缴纳保证金，承担按合同分派的任务。
	* 任务结束后：
		* 工作结果验收通过，退还保证金，支付RIU。（成为RIU持有者）。
		* 工作结果验收未通过，按合同扣除保证金，退换余额。

* 兑现交易
	* trustee管理兑现交易，按“价格优先、时间有限”原则撮合成交。
	* RIU持有者可以挂单，参与兑现交易。
	* 财务投资者可以参与兑现交易，成为RIU持有者。

* 改进
	* 任何人可以提出改进方案，预算全部使用RIU，报酬须单列。
	* 由worker、RIU持有者选项：假设worker合同的报酬RIU总额为w，RIU总额为r，待选方案数量为x，worker手中合同的每个RIU报酬权重为r*x*(100-p)，RIU持有者持有的每个RIU权重为w*x*p。
	* 通过立项后，方案提交者负责组织实施。由trustee拨付预算，如需拨付的RIU超过trustee手中持有量，可以发行新RIU。
	* 项目验收由trustee负责：
		* 工作结果验收通过，支付RIU报酬。
		* 工作结果验收未通过，不支付RIU报酬。

###分配规则
* 待兑现利益
	* 收入的p%用于购买RIU。现金归RIU原持有者，购得RIU由trustee持有，这部分RIU不参与投票。
	* 收入的(100-p)%流入工作预算，归admin使用。
