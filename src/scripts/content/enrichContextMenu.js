'use strict'

chrome.runtime.onMessage.addListener(function(msg, _sender, _sendResponse) {
    function insertText(templateId) {
        chrome.storage.sync.get(['options'], function(storage) {
            if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
            var templates = defaultOptions.templates;
            if (storage.options && storage.options.templates) templates = storage.options.templates;
            var template = templates.find(x => x.id === templateId);
            if (!template) {
                console.error("Template Not Found - id: " + templateId);
                return;
            }
            console.log("Template : " + template);
            console.log("Update : " + document.activeElement.value);
            document.activeElement.value = template.text;
        })
    }

    if (msg.hasOwnProperty('insertText') && msg.hasOwnProperty('templateId')) {
        insertText(msg.templateId);
    }
});