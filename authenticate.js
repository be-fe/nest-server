
/* npm modules */
var fs = require('fs');
var request = require('request');


/* loading configs */
//var serverUrl = config.serverUrl;
//var redirectUrl = config.redirectUrl;
//var loginUrl = config.loginUrl;


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

module.exports = function(server, userName, callback, message) {
    /*
     * init cookie jar
     * this feature is supported by tough-cookie
     * */
    var j = request.jar();
    var user = userHash[userName];

    console.log('首次访问登陆页面');
    request({url: server.loginUrl, jar: j}, function (err, res, body) {
        var lt = getValue('lt', body);
        var execution = getValue('execution', body);
        var eventId = getValue('_eventId', body);
        var type = getValue('type', body);

        console.log('尝试进行登陆');
        request({
            url: server.loginUrl,
            jar: j,
            method: 'POST',
            qs: {
                service: server.redirectUrl
            },
            form: {
                username: user.user,
                password: user.pass,
                lt: lt,
                execution: execution,
                _eventId: eventId,
                type: type
            }
        }, function (err, res, body) {

            console.log('登陆成功, 开始跳转到测试服务器');
            request({
                url: server.loginUrl,
                jar: j,
                method: 'GET',
                qs: {
                    service: server.redirectUrl
                }
            }, function (err, res, body) {

                // 开始运行登陆后的脚本
                callback(j);

            });
        });
    });
};