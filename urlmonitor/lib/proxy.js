const {Cu} = require('chrome');
Cu.import('resource://gre/modules/Services.jsm');

let utils = function() {
  return {
    copyPrefs : function(prefNames, fromBranch, toBranch) {
      console.log('copyPrefs CP1: prefnames=', prefNames, ' fromBranch=', fromBranch);
      try {
        for(let i = 0; i < prefNames.length; i++) {
          let prefName = prefNames[i];
          let prefType = fromBranch.getPrefType(prefName);
          switch(prefType) {
            case fromBranch.PREF_STRING:
              console.log(prefName + " : String");
              toBranch.setCharPref(prefName, fromBranch.getCharPref(prefName));
              break;
            case fromBranch.PREF_INT:
              console.log(prefName + " : Int");
              toBranch.setIntPref(prefName, fromBranch.getIntPref(prefName));
              break;
            case fromBranch.PREF_BOOL:
              console.log(prefName + " : Bool");
              toBranch.setBoolPref(prefName, fromBranch.getBoolPref(prefName));
              break;
            case fromBranch.PREF_INVALID:
              console.log(prefName + " : PREF_INVALID");
            default:
              console.log("Unknown pref type");
          }
        }
      } catch (e) {
        console.log("Error in copyPrefs: " + e);
      }
    }
  };
}();
module.exports = utils;

let proxyService = function() {
  let backupProxyPrefs = [
    "type", 
    "http", 
    "http_port",
    "ssl",
    "ssl_port",
    "ftp",
    "ftp_port",
    "no_proxies_on",
    "share_proxy_settings",
    "autoconfig_url"
  ];

  return {
    backupBrowserProxySettings : function() {
      try {
        console.log("Backup FF proxy settings");

        let proxyPrefs = Services.prefs.getBranch("network.proxy.");
        let extensionBackupProxyPrefs = Services.prefs.getBranch("extensions.browsec.backup.network.proxy.");

        utils.copyPrefs(backupProxyPrefs, proxyPrefs, extensionBackupProxyPrefs);
      }
      catch(e) {
        console.log("Backup error: " + e);
      }
    },

    restoreBrowserProxySettings : function() {
      try {
        console.log("Restore FF proxy settings");
      
        let proxyPrefs = Services.prefs.getBranch("network.proxy.");
        let extensionBackupProxyPrefs = Services.prefs.getBranch("extensions.browsec.backup.network.proxy.");

        utils.copyPrefs(backupProxyPrefs, extensionBackupProxyPrefs, proxyPrefs);
      }
      catch(e) {
        console.log("Restore error: " + e);
      }
    },

    clearProxySettingsBackup : function() {
      try {
        console.log("Clear FF proxy settings backup");
      
        Services.prefs.deleteBranch("extensions.browsec.backup.network.proxy.");
      }
      catch(e) {
        console.log("Clear proxy settings backup error: " + e);
      }
    },

    isProxySet : function(proxyUrl) {
      try {
        console.log("isProxySet");
      
        let proxy = this.parseProxyUrl(proxyUrl);
        let proxyHost = proxy.host;
        let proxyPort = proxy.port;

        let proxyPrefs = Services.prefs.getBranch("network.proxy.");

        return proxyPrefs.getIntPref("type") === 1 && proxyPrefs.getCharPref("http") === proxyHost && proxyPrefs.getIntPref("http_port") === proxyPort;
      }
      catch(e) {
        console.log("isProxySet error: " + e);
      }
    },

    setProxy : function (proxyUrl, bypass) {
      bypass = typeof bypass !== 'undefined' ? bypass : "localhost, localdomain, .localdomain, local, .local, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16";
      if (bypass.indexOf("www.google-analytics.com") < 0) {
        bypass += ", www.google-analytics.com";
      }

      try {

        let proxyPrefs = Services.prefs.getBranch("network.proxy.");

        if (proxyUrl == "DIRECT") {
          console.log("Set DIRECT proxy connection");
          proxyPrefs.setIntPref("type", 0);
        } else {
          console.log("Set proxy " + proxyUrl)
          proxyPrefs.setIntPref("type", 1);
          let proxy = this.parseProxyUrl(proxyUrl);
          let proxyHost = proxy.host;
          let proxyPort = proxy.port;
          proxyPrefs.setCharPref("http", proxyHost);
          proxyPrefs.setIntPref("http_port", proxyPort);
          proxyPrefs.setCharPref("ssl", proxyHost);
          proxyPrefs.setIntPref("ssl_port", proxyPort);
          proxyPrefs.setCharPref("ftp", proxyHost);
          proxyPrefs.setIntPref("ftp_port", proxyPort);
          proxyPrefs.setBoolPref("share_proxy_settings", false);
          proxyPrefs.setCharPref("no_proxies_on", bypass);
        }
      } catch (e) {
        console.log("Can't set proxy " + e);
      }
    },

    parseProxyUrl : function(proxyUrl) {
      let proxyParts = proxyUrl.split(':');
      let proxyHost = proxyParts[0];
      let proxyPort = proxyParts[1];

      return {host : proxyHost, port : proxyPort};
    },

    getBypass : function() {
      try {
        let proxyPrefs = Services.prefs.getBranch("network.proxy.");
        return proxyPrefs.getCharPref("no_proxies_on");
      } catch (e) {
        console.log("Can't get bypass: " + e);
        return null;
      }
    }
  };
}();

module.exports = proxyService;


