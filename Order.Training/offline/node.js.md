##Node.js
课程备忘录

###课程简介
1. Node.js 是基于 Chrome JavaScript 运行环境，用于便捷地搭建快速、可扩展的网络应用。它使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效，非常适合于运行在分布式设备的数据密集型实时应用。
2. 本课程使用[nodeschool](http://nodeschool.io/)的learnyounode中的部分任务，循序渐进地引导学员掌握异步IO、http等模块。

###能力结构
####任务一：实训基础
1. 实训课规则
2. 远程开发环境配置 
	1. 云服务器的购买和释放
	2. ubuntu/ssh/aptitude
	3. node.js

####任务二：Hello world
1. 创建一个.js后缀的文本文件。
2. 开始编写javascript代码。
3. 使用node运行学员的作品：
	<pre>
		node program.js	
	</pre>
4. 使用console.log("text")输出数据。 

####任务三：调用参数
1. 开发一个js程序，接收命令行调用参数 -- 几个整数。
2. 把调用参数的总和打印到标准输出设备（stdout）。
3. 提示：可以使用process.argv获得调用参数。
	* 调用： node program.js 1 2 3
	* 语句： console.log(process.argv)
	* 输出： [ 'node', '/path/to/your/program.js', '1', '2', '3' ]
4. [process](https://nodejs.org/api/process.html)是全局对象，可以在任何地方访问。它是 [EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter)的实例。

####任务四：本地IO
读取本地文件的内容。
1. 开发一个js程序，接收命令行调用参数 -- 一个本地文件的路径和文件名。
2. 通过一次同步文件访问读取这个文件的内容。
3. 统计这个文件中有几次换行(\n)，打印到标准输出设备（stdout)。
4. 提示：如果在fs.readFileSync()的第二个参数写"utf8"，它将直接返回一个字符串。

####任务五：异步和回调
1. 使用异步方法和回调函数访问文件系统，读取一个文件的内容并打印它的换行个数。
2. 提示：使用fs.readFile()代替fs.readFileSync()。

####任务六：遍历文件夹
1. 编写一个js程序，列出给定文件夹中的特定后缀的文件。
2. 调用时，第一个参数是文件夹路径，第二个参数是文件后缀。
	* 调用： node program.js /path/to/dir txt
	* 输出：
		<pre>
		1.txt
		2.txt
		3.txt
		</pre> 

####任务七：模块

1. 把上一个任务的功能封装到模块中，学员需要编写两个js文件完成这项工作。
2. 一个模块文件完成大部分工作，这个模块只导出（export）一个函数，它有三个参数依次是：
	1. 文件夹路径
	2. 文件后缀
	3. 回调函数
3. 调用时直接把命令行调用参数传递给模块，不需要做处理。
4. 模块只调用一次回调函数，回调函数必须使用（err,data）惯例：
	1. 如果没有错误时第一个参数是null，第二个参数是数据。本任务中，第二个参数是文件名数组（array）。
	2. 如果任何步骤出现错误，都使用回调函数第一个参数返回错误信息。
5. 模块内不要打印任何数据，只能通过主程序输出信息。模块内不要改变任何全局变量。
6. 主程序的回调函数如果收到错误信息，直接打印到标准输出设备（stdout）就行。
7. [模块参考文档](https://nodejs.org/docs/latest/api/modules.html)
8. 提示：模块只导出一个函数的语法
	<pre>
	module.exports = function (args) { /* ... */ }
	</pre>
9. 提示：使用自定义模块的语法
	<pre>
	var mymodule = require('./mymodule.js')
	</pre>

####任务八：http客户端
1. 开发一个js程序，它向第一个命令行调用参数指定的url发送http get请求。
2. 把每个data返回值的总字节数打印到标准输出设备上。
3. 把每个data返回值的内容合并起来，打印到标准输出设备上。
4. 提示：data返回值可以使用这个语法在回调函数内获得
	<pre>
	response.on("data",function (data){ /* ... */ });
	</pre>

####任务九：时间服务器
1. 开发一个服务器监听来自指定端口的TCP连接。
2. 所监听额端口由第一个命令行调用参数指定。
3. 对每一个TCP连接返回当前时间，格式为： "YYYY-MM-DD hh:mm"，后面跟一个回车。
4. 时间中的月、日、时、分都是0填充的两位数。

####任务十：文件服务器
1. 开发一个HTTP服务器。
2. 服务器监听第一个命令行调用参数指定的端口。
3. 服务器将第二个命令行调用参数指定的文件内容返回给客户端。

####任务十一：POST服务器
1. 开发一个HTTP服务器，它只回应POST请求。
2. 服务器把HTTP POST连接的body转成大写后返回给客户端。

####任务十二：JSON服务器
1. 开发一个HTTP服务器，提供两个API。
2. /api/parsetime：
	* 客户端以iso参数送来一个时间，例如：  
	<pre>
	/api/parsetime?iso=2013-08-10T12:10:15.474Z
	</pre>
	* 返回iso参数的时、分、秒，格式为：
	<pre>
	{
	  "hour": 14,
	  "minute": 23,
	  "second": 15
	}
	</pre>

3. /api/unixtime ：
	* 客户端以iso参数送来一个时间，例如：  
	<pre>
	/api/unixtime?iso=2013-08-10T12:10:15.474Z
	</pre>
	* 返回iso参数的unix格式：
	<pre>
	{ "unixtime": 1376136615474 }
	</pre>
4. 服务器监听的端口由第一个命令行调用参数提供。

###面授模式
###在线模式
###课程提供者信息及签名