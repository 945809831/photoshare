$(document).ready(function() {
    var photoId = '';
    var url = '';
    // 点击照片时，显示蒙板层中的照片评论
    $(".thumbnail").click(function(event) {
        photoId = $(this).find('img').attr('data-pid'); // 获取照片的id
        url = $(this).find('img').attr('src'); // 获取照片的url
        var mask = createMask();
        $('body').append(mask);
        loadPhotoComment(mask);
    });

    function loadPhotoComment(mask) {
        $.get('/users/getPhotoComment?url=' + url + '&pid=' + photoId, function(data, status) {
            // alert("Data: " + data + "\nStatus: " + status);
            mask.addContent(data);
        });
    }

    /**
     * 提交用户评论处理函数
     */
    function addComment() {
        var content = $('#new-comment').val();
        if (content === "") {
            return false;
        }
        mask.clear();
        loadPhotoComment(mask);
        return false;
    }
});
/**
 *  创建蒙板层，用于摆放图片及评论
 */
function createMask() {
    var mask = $('<div></div>').addClass('mask');
    // 关闭按钮
    var closeBtn = $('<span><span>').addClass('glyphicon glyphicon-remove close-button');
    closeBtn.click(function() {
        mask.remove();
    });
    mask.append(closeBtn);
    // mask中内容框，居中显示
    var content = $('<div></div>').addClass('container mask-content');
    mask.append(content);

    // 定义mask的add 方法，用于往mask中添加内容
    mask.addContent = function(html) {
        content.html(html);
    };
    // 定义mask的clear方法，用于情况mask的内容
    mask.clear = function() {
        content.html();
    }
    return mask;
}