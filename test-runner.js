var request = require('request');
var auth = require('./authenticate.js');
var TestRunner = function(response, serverName) {
    this.response = response;
    this.server = serverHash[serverName];
};

TestRunner.prototype = {
    cookieJars: {},
    tests: [],
    context: {},
    response: null,
    isRunning: false,
    run: function() {
        this.isRunning = true;

        var self = this;
        var test = this.tests.shift();

        if (!test) {
            self.response.end(JSON.stringify({
                status: 'success'
            }));
            return;
        }

        test.user = test.user || self.lastUser;
        self.lastUser = test.user;

        var runSingleTest = function() {
            var jar = self.cookieJars[test.user];
            test.jar = jar;
            test.url = self.server.serverUrl + test.url;

            request(test, function(err, res, body) {
                var resObject = {};
                try {
                    resObject = JSON.parse(body);
                } catch (ex) {
                    resObject = {};
                }

                var isFailed = false;
                test.callback({
                    json: resObject,
                    fail: function(message) {
                        self.response.end(JSON.stringify({
                            status: 'error',
                            message: message
                        }));
                        isFailed = true;
                    },
                    res: res,
                    err: err,
                    body: body
                });

                if (!isFailed) self.run();
            });
        };

        if (!self.cookieJars[test.user]) {
            auth(self.server, test.user, function(jar) {
                self.cookieJars[test.user] = jar;
                runSingleTest();
            });
        } else {
            runSingleTest();
        }
    },
    request: function(opts, callback) {
        opts.method = opts.method || 'get';
        opts.method = opts.method.toUpperCase();
        opts.qs = opts.query;
        delete opts.query;
        opts.callback = callback;

        this.tests.push(opts);

        if (!this.isRunning) {
            this.run();
        }
        return this;
    },
    get: function(opts) {
        opts.method = 'get';
        this.request.apply(this, arguments);
        return this;
    },
    post: function(opts) {
        opts.method = 'post';
        this.request.apply(this, arguments);
        return this;
    },
    put: function(opts) {
        opts.method = 'put';
        this.request.apply(this, arguments);
        return this;
    },
    remove: function(opts) {
        opts.method = 'delete';
        this.request.apply(this, arguments);
        return this;
    }
};

global.runTest = function(response, serverName) {
    var testRunner = new TestRunner(response, serverName);
    return testRunner;
};
