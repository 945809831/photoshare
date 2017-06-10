/**
 *  访问图片文件的路由，控制服务器图片目录中文件的访问
 */
'use strict'

function accessPhotos(path) {
    return function(req, res, next) {
        //console.log(req.path);
        // 获取存贮用户图片的目录
        var photoPath = req.app.get('photolib');
        if (req.path.startsWith(photoPath)) {
            res.sendFile(req.path);
            next();
        }
        next();
    };
}

module.exports = accessPhotos;