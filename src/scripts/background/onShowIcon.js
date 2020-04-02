'use strict'

chrome.runtime.onMessage.addListener(function(msg, _sender, _sendResponse) {
    var suffix = "\r\nDisabled - No jira elements to enrich";

    function iconShowHide(showIcon) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            if (!activeTab || !activeTab.id) return;
            chrome.pageAction.show(activeTab.id);
            chrome.pageAction.setIcon({
                tabId: activeTab.id,
                path: "images/icon48.png"
            });
            chrome.pageAction.getTitle({ tabId: activeTab.id }, function(title) {
                if (title.endsWith(suffix)) {
                    chrome.pageAction.setTitle({
                        tabId: activeTab.id,
                        title: title.replace(suffix, "")
                    });
                }
                if (!showIcon) {
                    chrome.pageAction.hide(activeTab.id);
                    chrome.pageAction.setIcon({
                        tabId: activeTab.id,
                        path: "images/icon48-dimmed.png"
                    });
                    chrome.pageAction.getTitle({ tabId: activeTab.id }, function(title) {
                        chrome.pageAction.setTitle({
                            tabId: activeTab.id,
                            title: title + suffix
                        })
                    });
                }
            });
        });
    }

    if (msg.hasOwnProperty('showIcon')) {
        iconShowHide(msg.showIcon);
    }
});