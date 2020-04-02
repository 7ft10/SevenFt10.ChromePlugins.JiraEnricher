'use strict'

var isDirty = false;

window.addEventListener("beforeunload", function(e) {
    if (!isDirty) {
        return;
    }
    var confirmationMessage = 'It looks like you have been editing something. ' +
        'If you leave before saving, your changes will be lost.';

    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
});

document.addEventListener('DOMContentLoaded', function() {

    function addBlankRow() {
        var row = document.getElementById("templateTable").querySelector("tbody").insertRow(0);
        var td = row.insertCell(0);
        td.appendChild(utils.createElementFromHTML(td, '<select><option>No Category</option><option value="Comments">Comments</option><option value="Agile">Agile</option></select>)'));
        td = row.insertCell(1);
        td.appendChild(utils.createElementFromHTML(td, '<input type="text" class="templateTitle"></input>'));
        td = row.insertCell(2);
        td.appendChild(utils.createElementFromHTML(td, '<textarea class="templateText" rows="3" cols="75"></textarea>'));
        td = row.insertCell(3);
        td.appendChild(utils.createElementFromHTML(td, '<button class="deleteRow">X</button>'));
        td.querySelector("button.deleteRow").addEventListener('click', function(evt) {
            document.getElementById("templateTable").querySelector("tbody").deleteRow(evt.srcElement.parentNode.parentNode.rowIndex);
        });
        return row;
    }

    function addNewRow(template) {
        var row = addBlankRow();
        var dd = row.querySelector('select');
        dd.selectedIndex = 0;
        for (var i = 0; i < dd.options.length; i++) {
            if (dd.options[i].value === template.type) {
                dd.selectedIndex = i;
                break;
            }
        }
        row.querySelector("input.templateTitle").value = template.title;
        row.querySelector("textarea.templateText").value = template.text;
    }

    document.querySelector("#createRow").addEventListener('click', function(_evt) {
        addBlankRow();
    });

    var addRank = document.querySelector("#addRank");
    var fixColors = document.querySelector("#fixColors");
    var fixFlags = document.querySelector("#fixFlags");
    var fixSubtasks = document.querySelector("#fixSubtasks");
    var fixServiceDeskQueues = document.querySelector("#fixServiceDeskQueues");
    var seperator = document.querySelector("#seperator");

    function saveRequired(_evt) {
        isDirty = true;
    }

    document.querySelector("#ResetBtn").addEventListener('click', function(_evt) {
        if (window.confirm("Reset all settings?")) {
            chrome.storage.sync.set({
                "options": defaultOptions
            }, function() {
                isDirty = false;
                window.close();
            });
        }
    });

    document.querySelector("#SaveBtn").addEventListener('click', function(_evt) {
        var templates = [];
        document.querySelectorAll('select').forEach(function(dd, i) {
            var type = dd.options[dd.selectedIndex].value;
            var template = {
                id: "Template_" + i,
                type: type == "No Category" ? null : type,
                title: dd.parentElement.parentElement.querySelector("input.templateTitle").value,
                text: dd.parentElement.parentElement.querySelector("textarea.templateText").value,
            };
            templates.push(template);
        });

        chrome.storage.sync.set({
            "options": Object.assign(defaultOptions, {
                addRank: addRank.checked,
                fixColors: fixColors.checked,
                fixFlags: fixFlags.checked,
                fixSubtasks: fixSubtasks.checked,
                fixServiceDeskQueues: fixServiceDeskQueues.checked,
                seperator: seperator.value,
                templates: templates
            })
        }, function() {
            isDirty = false;
            window.close();
        });
    });

    chrome.storage.sync.get("options", function(storage) {
        var options = (!chrome.runtime.lastError ? (storage.options ? storage.options : defaultOptions) : defaultOptions);
        addRank.checked = options.addRank;
        fixColors.checked = options.fixColors;
        fixFlags.checked = options.fixFlags;
        fixSubtasks.checked = options.fixSubtasks;
        fixServiceDeskQueues.checked = options.fixServiceDeskQueues;
        seperator.value = options.seperator;
        (options.templates || []).forEach(function(template) {
            addNewRow(template);
        });
    });

    addRank.addEventListener('change', saveRequired, false);
    fixColors.addEventListener('change', saveRequired, false);
    fixFlags.addEventListener('change', saveRequired, false);
    fixSubtasks.addEventListener('change', saveRequired, false);
    fixServiceDeskQueues.addEventListener('change', saveRequired, false);
    seperator.addEventListener('blur', saveRequired, false);
});