'use strict'

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

Array.prototype.remByVal = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

var utils = {
    documentQuerySelectorAll: function(document, selector, callback) {
        var el = document.querySelectorAll(selector);
        if (el && el.length > 0) {
            callback(el);
        }
    },
    documentQuerySelector: function(document, selector, callback) {
        var el = document.querySelector(selector);
        if (el) {
            callback(el);
        }
    },
    createSpanFromHTML: function(elem, htmlString) {
        var span = elem.createElement ? elem.createElement('span') : elem.ownerDocument.createElement('span');
        span.innerHTML = (htmlString || "").trim();
        return span;
    },
    createElementFromHTML: function(elem, htmlString) {
        var div = elem.createElement ? elem.createElement('div') : elem.ownerDocument.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    },
    removeAllChildren: function(node) {
        var child = node.lastElementChild;
        while (child) {
            try {
                node.removeChild(child);
                child = node.lastElementChild;
            } catch (e) {
                child = null;
            }
        }
    },
    getJSON: function(url) {
        return new Promise(function(success, failure) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function() {
                try {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(this.response);
                        if (success) success(data);
                    } else {
                        if (failure) failure(request.statusText);
                    }
                } catch (e) {
                    if (failure) failure(e);
                }
            }
            request.send();
        });
    },
    pagedJIRA: function(url, field) {
        return new Promise(function(success, failure) {
            utils.getJSON(url + "maxResults=100&startAt=0").then(function(data) {
                try {
                    var startAt = 100;
                    var total = data.total;
                    var pages = [data[field]];
                    while (startAt <= total) {
                        pages.push(utils.getJSON(url + "&maxResults=100&startAt=" + startAt));
                        startAt += 100;
                    }
                    Promise.all(pages).then(function(results) {
                        try {
                            if (results[field]) {
                                success(results[field].flat());
                            } else {
                                success(results.flat());
                            }
                        } catch (e) {
                            if (failure) failure(e);
                        }
                    });
                } catch (e) {
                    if (failure) failure(e);
                }
            }).catch(function(err) {
                failure(err);
            });
        });
    },
    observeChanges: function(node, execute) {
        var observer = new MutationObserver(function() {
            observer.disconnect();
            execute(node);
            observer.observe(node, { childList: true, subtree: true });
        });
        execute(node);
        observer.observe(node, { childList: true, subtree: true });
    },
    waitForElement: function(node, selector) {
        return new Promise(function(resolve, _reject) {
            utils.waitForElements(node, selector).then(function(founds) {
                resolve(founds[0]);
            });
        });
    },
    waitForElements: function(node, selector) {
        return new Promise(function(resolve, _reject) {
            var found = node.querySelectorAll(selector);
            if (found.length > 0) {
                resolve(found);
                return;
            }
            var observer = new MutationObserver(function() {
                var found = node.querySelectorAll(selector);
                if (found.length > 0) {
                    observer.disconnect();
                    resolve(found);
                    return;
                }
            });
            observer.observe(node, { childList: true, subtree: true });
        });
    },
    convertHex: function(hex, opacity) {
        if (hex.startsWith("rgb(")) {
            return hex.replace("rgb", "rgba").replace(")", ',' + opacity + ')');
        } else {
            hex = hex.replace('#', '');
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        }
    }
}