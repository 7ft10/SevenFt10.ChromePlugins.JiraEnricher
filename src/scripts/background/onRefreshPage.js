'use strict'

chrome.runtime.onMessage.addListener(function(msg, sender, _sendResponse) {
    function refreshPage(tabId) {
        chrome.tabs.reload(tabId);
    }

    if (msg.hasOwnProperty('refreshPage')) {
        refreshPage(sender.tab.id);
    }
});