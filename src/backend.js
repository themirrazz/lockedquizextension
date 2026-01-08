// if(location.hash === '#gfu') chrome.runtime.send("fsnp");
window.wrappedJSObject.EnterKioskMode = exportFunction(() => {
    chrome.runtime.sendMessage("kisok-enter");
}, window);

window.wrappedJSObject.WhoopsieDaises = exportFunction(() => {
    chrome.runtime.sendMessage("fsnp");
}, window);


window.wrappedJSObject.ExitKioskMode = exportFunction(() => {
    chrome.runtime.sendMessage("kisok-exit");
}, window);