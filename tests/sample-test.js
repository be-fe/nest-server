/**
 * 使用说明:
 * runTest(response, serverName)
 * serverName指的是servers下设置的server名称
 *
 * runTest后可以跟 .get, .post, .remove, .put 的后续操作
 * 分别对应 method:GET, method:POST, method:DELETE, method:PUT 的请求
 *
 * 所有函数的原型为:
 *  get ( options, callback )
 *
 * options 有:
 * options.url      测试的目标地址 (必须)
 * options.user     以谁登陆 (可选, 但第一个请求为必须)
 * options.form     以form形式传递参数 (post 的form 参数)
 * options.query    以query string形式传递参数 (url 的query 的参数)
 *
 * callback的原型是:
 * callback(runner)
 * runner                   为每一次测试 test runner 注入的对象 -
 * runner.fail( message )   将本次测试标记为失败
 * runner.json              将测试请求返回的结果处理为json, 如处理失败, 则为null
 * runner.res               测试请求返回的原response
 * runner.body              测试返回的原结果 (原文本)
 * runner.err               如果测试返回的err
 *
 * 如果任何test没有标记测试为失败, 则最终测试将会被认为成功的.
 *
 * @param response 本server的response对象, 用于给runTest处理最终的测试结果
 */

module.exports = function(response) {
    runTest(response, 'irm-test')
        .get({
            user: 'wujun07',
            url: urls.getCurrentUserInfo,
        }, function(runner) {
            // 查询当前用户
        })
        .post({
            user: 'yuyapei',
            url: urls.getCostCenters,
            query: {
                a: 1,
                pageNo: 2
            }
        }, function(runner) {
            // 查询成本中心第一页
            console.log(runner.json);
        });
};