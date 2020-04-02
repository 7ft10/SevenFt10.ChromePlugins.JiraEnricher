'use strict'

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "Options":
            chrome.runtime.openOptionsPage();
            break;
        case "Visit":
            var manifest = chrome.runtime.getManifest();
            if (manifest && manifest.homepage_url) {
                chrome.tabs.create({ url: manifest.homepage_url });
            }
            break;
        default:
            if (info.menuItemId.includes("Template_")) {
                chrome.tabs.sendMessage(tab.id, {
                    insertText: true,
                    templateId: info.menuItemId
                });
            }
    }
});

chrome.contextMenus.removeAll(function() {
    chrome.storage.sync.get(['options'], function(storage) {
        var docPattern = { documentUrlPatterns: ["*://*.atlassian.net/*"] };
        chrome.contextMenus.create(Object.assign(docPattern, {
            contexts: ["all"],
            id: "Top",
            title: "Jira Enricher"
        }));
        // templates
        chrome.contextMenus.create(Object.assign(docPattern, {
            contexts: ["editable"],
            id: "Templates",
            title: "Templates",
            parentId: "Top"
        }));
        var templates = (storage.options && storage.options.templates) ? storage.options.templates : defaultOptions.templates;
        var categoriesCreated = [];
        templates.forEach(function(template) {
            if (template.type != null && categoriesCreated.indexOf(template.type) == -1) {
                chrome.contextMenus.create(Object.assign(docPattern, {
                    contexts: ["editable"],
                    id: template.type,
                    title: template.type,
                    parentId: "Templates"
                }));
                categoriesCreated.push(template.type);
            }
            chrome.contextMenus.create(Object.assign(docPattern, {
                contexts: ["editable"],
                id: template.id,
                title: template.title,
                parentId: template.type || "Templates",
            }));
        });
        // options
        chrome.contextMenus.create(Object.assign(docPattern, { contexts: ["all"], id: "Options", title: "Options", parentId: "Top" }));
        // visit
        chrome.contextMenus.create(Object.assign(docPattern, { contexts: ["all"], id: "Visit", title: "Visit SMEx Digital", parentId: "Top" }));
    });
});