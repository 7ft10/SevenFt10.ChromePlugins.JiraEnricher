'use strict'

chrome.runtime.onMessage.addListener(function(msg, _sender, _sendResponse) {
    function insertText(templateId) {
        var oldCursor = document.activeElement.style.cursor;
        document.activeElement.style.cursor = "progress";
        chrome.storage.sync.get(['options'], function(storage) {
            if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
            var templates = (storage.options && storage.options.templates) ? storage.options.templates : defaultOptions.templates;
            var template = templates.find(function(el) {
                return el.id === templateId;
            });
            if (!template) {
                console.error("Template Not Found - id: " + templateId);
            } else {
                if (["div", "span", "p", "ol", "li", "td"].indexOf(document.activeElement.tagName.toLowerCase()) > -1 ||
                    document.activeElement.isContentEditable) {
                    document.activeElement.innerHTML = template.text;
                } else if (["input", "textarea"].indexOf(document.activeElement.tagName.toLowerCase()) > -1 ||
                    document.activeElement.hasOwnProperty("value")) {
                    document.activeElement.value = template.text;
                } else if (document.activeElement.hasOwnProperty("textContent")) {
                    document.activeElement.textContent = template.text;
                } else {
                    document.activeElement.innerText = template.text;
                }
            }
            document.activeElement.style.cursor = oldCursor;
        })
    }

    if (msg.hasOwnProperty('insertText') && msg.hasOwnProperty('templateId')) {
        insertText(msg.templateId);
    }
});