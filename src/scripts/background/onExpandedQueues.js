'use strict'

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    function saveExpandedQueues(expandedQueues) {
        chrome.storage.sync.set({
            "expandedQueues": expandedQueues
        });
    }

    if (msg.hasOwnProperty('expandedQueues')) {
        saveExpandedQueues(msg.expandedQueues);
    }
});