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
            form: {
                a: 1,
                pageNo: 2
            }
        }, function(runner) {
            // 查询成本中心第一页
            console.log(runner.json);
        });
};