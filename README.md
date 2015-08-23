# nest-server
用于做bird-server, java环境, itebeta登陆的半自动化测试或快速登陆工具

## Getting Started


### 环境要求
首先, 这个工具是专门针对百度一个开发的模式:

* bird-server : 用于前后端分离的, 做数据重定向的开发服务器
* itebeta : 用于提供测试环境中用户登陆的服务器
* java后台 : 可能有其他系统用的是其他后台, 如有需求, 可以联系 zhengliangliang@baidu.com 在进行额外的集成

### 配置项目

* 安装nodejs
* git clone此项目
* 安装 bower ```npm install -g bower```
* 在根目录下 ```npm install``` 以及 ```bower install```
* 根目录下执行 ```node server```
    * 也推荐使用nodemon来运行, 因为nodemon可以根据修改实时更新
    * 如果遇到问题, 可以用node debug和node-inspector来做调试

### 配置服务器, 登陆用户, 和测试

这些配置分别在一下的文件夹:

* ```servers```
* ```users```
* ```tests```

可以根据里面的例子来进行配置.

### 工具首页

运行服务器之后, 用浏览器登陆 ```http://localhost:4200```