const {Cu} = require('chrome');
Cu.import('resource://gre/modules/Services.jsm');

const PREF_BRANCH = "extensions.browsec.";
const PREFS = {
  active: false,
  bypass: "localhost, localdomain, .localdomain, local, .local, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
  firstrun: true
};

/**
 * Get the preference value of type specified in PREFS
 */

function getPref(key, aDefault) {
  // Cache the prefbranch after first use
  if (getPref.branch == null)
    getPref.branch = Services.prefs.getBranch(PREF_BRANCH);

  var prefType = getPref.branch.getPrefType(key);

  // underlying preferences object throws an exception if pref doesn't exist
  if (prefType == getPref.branch.PREF_INVALID)
    return aDefault;

  // Figure out what type of pref to fetch
  switch(prefType) {
    case getPref.branch.PREF_BOOL:
      return getPref.branch.getBoolPref(key);
    case getPref.branch.PREF_STRING:
      return getPref.branch.getCharPref(key);
    case getPref.branch.PREF_INT:
      return getPref.branch.getIntPref(key);
  }
  return null;
}
exports.getPref = getPref;

function setPref(key, val) {
  try {
    let branch = Services.prefs.getBranch(PREF_BRANCH);

    switch (typeof val) {
      case "boolean":
        branch.setBoolPref(key, val);
        break;
      case "string":
        branch.setCharPref(key, val);
        break;
    }
  } catch (err) {
    console.log("Error in setPref: " + err);
  }
}
exports.setPref = setPref;

/**
 * Initialize default preferences specified in PREFS
 */
function setDefaultPrefs() {
  console.debug("setDefaultPrefs CP1");
  let branch = Services.prefs.getDefaultBranch(PREF_BRANCH);
  for (let key of Object.keys(PREFS)) {
    let val = PREFS[key];
    console.debug("setDefaultPrefs CP2: key=" + key + " val=" + val);
    switch (typeof val) {
      case "boolean":
        branch.setBoolPref(key, val);
        break;
      case "string":
        branch.setCharPref(key, val);
        break;
    }
  }
}
exports.setDefaultPrefs = setDefaultPrefs;
