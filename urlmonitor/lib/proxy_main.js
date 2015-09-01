var  proxyService = require('./proxy');
const {getPref, setPref} = require('./prefs');

function proxy_start(){
	var localProxyHost = "127.0.0.1";
  	var localProxyPort = 49737;

	var localProxyUrl = localProxyHost + ":" + localProxyPort; 
        if (!proxyService.isProxySet(localProxyUrl)) {
          proxyService.backupBrowserProxySettings();
        }
        var bypass = getPref('bypass');
        proxyService.setProxy(localProxyUrl, bypass);
}
function proxy_stop(){
        setPref("bypass", proxyService.getBypass());
        proxyService.restoreBrowserProxySettings();
        proxyService.clearProxySettingsBackup();
}
exports.proxy_start = proxy_start;
exports.proxy_stop = proxy_stop;
