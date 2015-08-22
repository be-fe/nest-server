
/* npm modules */
var fs = require('fs');
var request = require('request');

/* constants */
var JSESSIONID_KEY = 'JSESSIONID';
var JSESSIONID_REG = /(JSESSIONID=)([^'";]+)/g;

/* loading configs */
var config = require('./config.js');
var serverUrl = config.serverUrl;
var redirectUrl = config.redirectUrl;
var loginUrl = config.loginUrl;

/*
 * init cookie jar
 * this feature is supported by tough-cookie
 * */
var j = request.jar();

var listCostCenter = '/costCenter/list.json';

/**
 * 从html文本里抽取form input的name和value.
 * @param name
 * @param htmlString
 * @returns {*}
 */
var getValue = function(name, htmlString) {
	var reg = new RegExp('name=[\'"]' + name + '[\'"][^v]+value=[\'"]([^"]+)[\'"]');
	var match = reg.exec(htmlString);
	if (match) return match[1];

	reg = new RegExp('value=[\'"]([^"]+)[\'"][^n]+name=[\'"]' + name + '[\'"]');
	var match = reg.exec(htmlString);
	if (match) return match[1];
	return false;
};

console.log('首次访问登陆页面');
request({url: loginUrl, jar: j}, function(err, res, body) {
	var lt = getValue('lt', body);
	var execution = getValue('execution', body);
	var eventId = getValue('_eventId', body);
	var type = getValue('type', body);

    console.log('尝试进行登陆');
	request({
		url: loginUrl,
		jar: j,
		method: 'POST',
		qs: {
			service: redirectUrl
		},
		form: {
			username: 'yuyapei',
			password: 'yuyapei',
			lt: lt,
			execution: execution,
			_eventId: eventId,
			type: type
		}
	}, function(err, res, body) {

        console.log('登陆成功, 开始跳转到测试服务器');
		request({
			url: loginUrl,
			jar: j,
			method: 'GET',
			qs: {
				service: redirectUrl
			}
		}, function(err, res, body) {

            if (config.birdConfigPath && fs.existsSync(config.birdConfigPath)) {
                console.log('发现bird server配置, 替换JSESSIONID');
                var content = fs.readFileSync(config.birdConfigPath).toString();
                var cookies = j.getCookies(config.serverUrl);
                var jsessionidValue = '';
                cookies.some(function(cookie) {
                    if (cookie.key == JSESSIONID_KEY) {
                        jsessionidValue = cookie.value;
                        return true;
                    }
                    return false;
                });

                content = content.replace(JSESSIONID_REG, '$1' + jsessionidValue);
                fs.writeFileSync(config.birdConfigPath, content);
            }
            console.log('加载半自动化接口测试.');
			request({
				url: serverUrl + listCostCenter,
				jar: j,
				method: 'POST'
			}, function(err, res, body) {
				console.log(body);
			});
		});
	});
});
