'use strict'

utils.documentQuerySelector(document, "div[id='jira-frontend']", function(frontEnd) {
    chrome.storage.sync.onChanged.addListener(function(changes) {
        if (!changes.hasOwnProperty('expandedQueues')) {
            chrome.runtime.sendMessage({
                refreshPage: true
            });
        }
    });

    chrome.storage.sync.get(['options', 'expandedQueues'], function(storage) {
        var options = (!chrome.runtime.lastError ? (storage.options ? storage.options : defaultOptions) : defaultOptions);
        var expandedQueues = (!chrome.runtime.lastError ? (storage.expandedQueues ? storage.expandedQueues : []) : []);
        if (!Array.isArray(expandedQueues)) expandedQueues = [];
        var sep = options.seperator;

        function onclick(e) {
            var el = e.srcElement;
            while (!el.dataset.enriched) el = el.parentElement;
            if (el.dataset.enriched == "hide") {
                document.querySelectorAll("div[class*='enrichedQueuesHide'][data-key='" + el.dataset.key + "']").forEach(function(q) {
                    q.classList.add("enrichedQueuesShow");
                    q.classList.remove("enrichedQueuesHide");
                })
                el.dataset.enriched = "show";
                expandedQueues.push(el.dataset.key);
            } else {
                document.querySelectorAll("div[class*='enrichedQueuesShow'][data-key='" + el.dataset.key + "']").forEach(function(q) {
                    q.classList.add("enrichedQueuesHide");
                    q.classList.remove("enrichedQueuesShow");
                })
                el.dataset.enriched = "hide";
                expandedQueues.remByVal(el.dataset.key);
            }
            try {
                chrome.runtime.sendMessage({
                    expandedQueues: expandedQueues
                });
            } catch (e) {
                console.error(["Jira Enricher: Sending message to expand queues", e]);
            }
            e.preventDefault();
        }

        function fixQueues(headerQueues) {
            for (var key in headerQueues) {
                var queues = headerQueues[key];
                if (!queues || !Array.isArray(queues)) continue;
                var total = 0;

                var h = queues[0].cloneNode();
                var linkGuts = queues[0].innerHTML;

                queues.forEach(function(que) {
                    que.querySelectorAll("div").forEach(function(t) {
                        if (t.innerText.includes(key + sep)) t.innerText = t.innerText.replace(key + sep, "• ");
                    });
                    que.dataset.key = key;
                    que.classList.add(expandedQueues.includes(key) ? "enrichedQueuesShow" : "enrichedQueuesHide");
                });

                var a = utils.createElementFromHTML(document, linkGuts);
                a.dataset.key = key;
                a.dataset.enriched = expandedQueues.includes(key) ? "show" : "hide";
                a.style = "cursor: auto;";
                a.querySelectorAll("div").forEach(function(t) {
                    if (t.innerText.includes(key + sep)) t.innerText = key;
                });
                try {
                    if (a.querySelector("span") != null) {
                        a.querySelector("span").innerText = total != null ? total : "?";
                        a.querySelector("span").classList.add("total");
                    } else {
                        var newSpan = utils.createSpanFromHTML(document, total != null ? total : "?");
                        newSpan.classList.add("total");
                        a.querySelectorAll("div")[1].appendChild(newSpan);
                    }
                } catch (e) {
                    console.error(["Jira Enricher: Unable to get total field for " + key, e]);
                }
                try {
                    var arrow = utils.createElementFromHTML(document, '<div style="position: absolute; right: 0;"><span><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z" fill="currentColor" fill-rule="evenodd"></path></svg></span></div>');
                    a.appendChild(arrow);
                    a.addEventListener("click", onclick, false);
                    h.appendChild(a);
                    queues[0].parentNode.insertBefore(h, queues[0]);
                } catch (e) {
                    console.error(["Jira Enricher: Unable create new header for " + key, e]);
                }
                queues.forEach(function(que) {
                    utils.observeChanges(que, function(q) {
                        if (q.querySelector("span") != null) {
                            var oldQues = document.querySelectorAll('div[data-key="' + q.dataset.key + '"]');
                            var newTotal = 0;
                            oldQues.forEach(function(oldQ) {
                                if (oldQ.querySelector("span") != null) {
                                    newTotal += parseInt(oldQ.querySelector("span").innerText);
                                }
                            });
                            var oldA = document.querySelector('a[data-key="' + q.dataset.key + '"]');
                            if (oldA != null && oldA.querySelector("span.total") != null) {
                                oldA.querySelector("span.total").innerText = newTotal != null ? newTotal : "?";
                            }
                        }
                    });
                });
            }
        }

        if (options.fixServiceDeskQueues) {
            utils.observeChanges(frontEnd, function() {
                utils.waitForElement(document, "div[data-rbd-droppable-id='sd-queues-custom']").then(function(queue) {
                    chrome.runtime.sendMessage({
                        showIcon: true
                    });
                    utils.waitForElements(queue, "div[role='presentation']").then(function(queues) {
                        var headerQueues = [];
                        queues.forEach(function(que, index) {
                            if (que.innerText.includes(sep)) {
                                var key = que.innerText.substring(0, que.innerText.indexOf(sep));
                                if (!headerQueues[key]) headerQueues[key] = [];
                                headerQueues[key].push(que);
                            }
                        });
                        if (Object.keys(headerQueues).length > 0) {
                            fixQueues(headerQueues);
                        }
                    });
                });
            });
        }
    });
});