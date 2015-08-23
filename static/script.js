;(function() {
    $(function() {
        var $servers = $('.servers entry');
        var $users = $('.users entry');
        var $tests = $('.tests entry');
        var $loginSection = $('.login-section');

        $servers.each(function() {
            var $this = $(this);

            if ($this.attr('data-bird') === 'true') {
                $loginSection.show();
                return true;
            }
        });

        var setStatus = function($this, status, message, $clearAllSection) {
            $clearAllSection ? $clearAllSection.find('i').remove() : $this.next().remove();
            $this.after('<i class="' + status + '">' + message + '</i>');

        };

        $('a').click(function() {
            var $this = $(this);
            if ($this.parents('.tests').length) {
                setStatus($this, 'loading', '测试中');
                $.get($this.attr('href'), function(res) {
                    if (res.status == 'error') {
                        setStatus($this, 'error', '测试失败');
                    } else {
                        setStatus($this, 'success', '测试成功');
                    }
                });
            } else if ($this.is('.run-all-tests')) {
                $tests.find('i').remove();
                var interval = 1000;
                $tests.each(function() {
                    $(this).find('a').click();
                });
            } else if ($this.parents('.users').length) {
                var serverName = $('[name=server]:checked').val();
                var url = $this.attr('href') + '&servername=' + serverName;

                setStatus($this, 'loading', '登入中', $users);
                $.get(url, function(res) {
                    setStatus($this, 'success', '已登入', $users);
                    console.log(res);
                });
            }

            return false;
        });
    });
})();