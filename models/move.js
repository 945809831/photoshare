var fs = require('fs');
module.exports = function move(oldPath, newPath, callback) {
	fs.rename(oldPath, newPath, function(err){
		if(err){
			if(err.code === 'EXDEV'){
				console.log("can't move between two disk");
			} else {
				callback(err);
			}
		}
		return;
	});
	callback();
};