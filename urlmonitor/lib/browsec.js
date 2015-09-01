const {when: unload} = require('sdk/system/unload');
function start(){
	var remotePort = 443;
        var remoteHost = 'postlm.com';
	var localProxyPort = 49737;
        var tunnel = require('./tunnel').createServer(remoteHost, remotePort).listen(localProxyPort);
        unload(function() {
          tunnel.close();
	});
}
exports.start = start;
