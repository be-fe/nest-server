/**
 * 这是一个sample的server设置
 *
 * name: 			server的名称, 也作为id用
 * loginUrl:		itebeta的登陆页面
 * serverUrl:		要执行测试或快速登陆的服务
 * redirectUrl: 	从itebeta登陆跳转的目标地址, 一般是接受itebeta登陆后的token的服务的api
 * birdConfigPath:  bird服务器的设置文件, 当birdConfigPath有值时, 页面会显示出user的列表, 以供快速登陆.
 *
 *
 * @type {{name: string, redirectUrl: string, serverUrl: string, loginUrl: string, birdConfigPath: string}}
 */
module.exports = {
	name: 'irm-test',
	redirectUrl: 'http://cq01-art-devapp2.epc.baidu.com:8921/irm-server/j_spring_cas_security_check?spring-security-redirect=/index.xhtml',
	serverUrl: 'http://cq01-art-devapp2.epc.baidu.com:8921/irm-server/',
	loginUrl: 'http://itebeta.baidu.com:8100/login',
	birdConfigPath: '/Users/lzheng/development/baihui/ng-irm-trunk/bird-server.js'
};