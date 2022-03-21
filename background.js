/*
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});
*/

var manifestData = chrome.runtime.getManifest();
let extensionId = chrome.runtime.id;

console.log("manifestData",manifestData);
console.log("extensionId",extensionId);

let extensionTitle = "hello";


// =========================================================
var logLevel = 1;
  
// Sync log level if we have storage permission
try {
    chrome.permissions.contains({ permissions: ['storage']}, (allowed) => {
        if (allowed && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get('logLevel', function(items) {
                logLevel = parseInt(items.logLevel || "2");
                chrome.storage.onChanged.addListener(function(changes, areaName) {
                for (key in changes) {
                    var storageChange = changes[key];
                    if (key='logLevel' && areaName === 'local' ) {
                        logLevel = storageChange.newValue;
                        console.log('logLevel Changed',logLevel);
                    }
                }
                });
            });
        } else {
            console.warn("Could not access storage to read/watch log level changes");
        }
    });
} catch (err) {
    console.error("Error during log/level listener setup " + err);
}
// =========================================================
function ensureString(obj) {
    if (obj) {
        return (typeof obj === 'string' || obj instanceof String) ? obj : obj.toString();
    } else {
        return "";
    }
}

var port = null;
var hostName = "com.dasan.example.echo";

function sendMessageToNativeApp(request) {
    if (port != null) 
    {
        // Make sure all required entries are strings as expected by native app.
        let msg = JSON.parse(JSON.stringify(request));
        msg.message = ensureString(msg.message);
        msg.requestId = ensureString(msg.requestId);
        msg.apiClientId = ensureString(msg.apiClientId);

        port.postMessage(msg);
        console.log(JSON.stringify(msg));
    }
    else
    {
        console.log("PORT NULL");  
    }

}

function onNativeMessageReceived(response) {
    console.log("onNativeMessageReceived",JSON.stringify(response));
}
//==============================================================================
//
//==============================================================================
try {
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessageReceived);

    port.onDisconnect.addListener(() => {
          
      var err = chrome.runtime.lastError ? chrome.runtime.lastError.message : null;

      console.log(err);
      port = null;

    });

} catch(err) {
    console.log(err);
}

console.log("START");
let timerId = setInterval(() => {
    console.log("setInterval");
    //console.log(port);
    
    sendMessageToNativeApp({"message":"getdevices"});
    //sendMessageToNativeApp({"message":"currentState"});
}, 2000);
//===============================================================================