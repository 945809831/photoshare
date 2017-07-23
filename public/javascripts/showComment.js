$(function() {
    // 载入页面内容后再定义处理事件, 否则会在DOM加载前定义事件处理
    // 检测评论框的内容，如果为空字符串，则使提交按钮禁用状态
    $('#new-comment').change(function inputChange() {
        var txt = $(this).val();
        var submitBtn = $('#submit-btn');
        if (txt === '') {
            submitBtn.attr('disabled', true);
        } else {
            submitBtn.attr('disabled', false);
        }
    });

    // 点击可见性以改变照片的可见性
    $('.photo-visibility').click(function(event) {
        event.preventDefault(); // 防止页面跳转
        var source = event.target; // 获得事件源
        var url = $(source).attr('href'); // 得到请求的url地址
        var visibility = $(source).text();
        $.get(url, function(data, status) {
            $('.photo-vi').text(visibility);
            // alert("Data: " + visibility + "\nStatus: " + status);
        });
    });
});