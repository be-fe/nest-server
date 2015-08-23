var fs = require('fs');
var auth = require('./authenticate.js');

;(function() {
    var serverFiles = fs.readdirSync('./servers');
    var userFiles = fs.readdirSync('./users');

    global.servers = [];
    global.users = [];

    global.serverHash = {};
    global.userHash = {};

    serverFiles.forEach(function (serverFile, index) {
        if (/\.js$/.exec(serverFile)) {
            var server = require('./servers/' + serverFile);
            server.name = server.name || server.serverUrl
            global.servers.push(server);
            global.serverHash[server.name] = server;

        }
    });

    userFiles.forEach(function(userFile, index) {
        if (/\.js$/.exec(userFile)) {
            var usersInFile = require('./users/' + userFile);
            usersInFile.forEach(function(user, userIndex) {
                if (typeof user == 'string') {
                    user = {
                        user: user
                    };
                }
                global.userHash[user.user] = user;

                user.name = user.name || user.user;
                user.pass = user.pass || user.user;
                global.users.push(user);
            });
        }
    });
})();

module.exports = {
    index: function(req, res, next) {
        var html = '<html><body>' +
            '<link href="/static/style.css" type="text/css" rel="stylesheet">' +
            '<script src="/static/vendor/jquery/dist/jquery.js"></script>' +
            '<script src="/static/script.js"></script>' +
            '<section class="login-section"><h2>Servers</h2><div class="servers">{{servers}}</div>' +
            '<h2>Users</h2><div class="users">{{users}}</div></section>' +
            '<h2>Tests</h2>' +
            '<entry><a class="run-all-tests" href="#">Run all</a></entry>' +
            '<div class="tests">{{tests}}</div>' +
            '</body></html>';

        var serverHtml = [];
        global.servers.forEach(function(server, index) {
            serverHtml.push('<entry' + ' data-bird="' + (server.birdConfigPath ? true : false) + '">' +
                '<input name="server" ' +
                ' value="' + server.name + '"' +
                ' type="radio" ' + (index == 0 ? 'checked' : '') +
                '>' + server.name + '</entry>');
        });
        html = html.replace('{{servers}}', serverHtml.join('\n'));

        var userHtml = [];
        global.users.forEach(function(user, index) {
                userHtml.push('<entry><a href="/login?username=' + user.user + '">' + user.name + '</a></entry>');
        });
        html = html.replace('{{users}}', userHtml.join('\n'));

        var testFiles = fs.readdirSync('./tests');
        var testHtml = [];
        testFiles.forEach(function(file) {
            if (/\.js$/.exec(file)) {
                testHtml.push('<entry><a href="/tests/' + file + '">' + file + '</a></entry>');
            }
        });
        html = html.replace('{{tests}}', testHtml.join('\n'));

        res.end(html);
    },
    runTest: function(req, res, next, query) {
        var rgxTestPath = /^(\/tests\/.+)/;
        res.setHeader('Content-Type', 'application/json');
        var match = rgxTestPath.exec(query.pathname);
        var testFile = match[1];

        var testFunc = require('.' + testFile);
        testFunc(res);
    },
    login: function(req, res, next, urlObject) {
        res.setHeader('Content-Type', 'application/json');

        var query = urlObject.query;
        var server = serverHash[query.servername];
        auth(server, query.username, function(j) {
            var JSESSIONID_KEY = 'JSESSIONID';
            var JSESSIONID_REG = /(JSESSIONID=)([^'";]*)/g;

            if (server.birdConfigPath && fs.existsSync(server.birdConfigPath)) {
                console.log('发现bird server配置, 替换JSESSIONID');
                var content = fs.readFileSync(server.birdConfigPath).toString();
                var cookies = j.getCookies(server.serverUrl);
                var jsessionidValue = '';
                cookies.some(function (cookie) {
                    if (cookie.key == JSESSIONID_KEY) {
                        jsessionidValue = cookie.value;
                        return true;
                    }
                    return false;
                });

                content = content.replace(JSESSIONID_REG, '$1' + jsessionidValue);
                console.log('jsessionid=', jsessionidValue, 'content=', content); //@test
                fs.writeFileSync(server.birdConfigPath, content);
                res.end(JSON.stringify({status: 'success'}));
            }
        });
    }
};