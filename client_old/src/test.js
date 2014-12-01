var zlib = require('zlib');
var unzlibWithBase64 = function(str,cb) {
	var buffer = new Buffer(str, 'base64');
	zlib.unzip(buffer, function(err, buffer) {
		cb(err,buffer.toString());
	});
}
