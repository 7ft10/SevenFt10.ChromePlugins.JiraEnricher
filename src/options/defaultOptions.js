'use strict'

var defaultOptions = {
    addRank: true,
    fixColors: true,
    fixFlags: true,
    fixSubtasks: true,
    fixServiceDeskQueues: true,
    seperator: " - ",
    templates: [{
        id: "Template_1",
        title: "Support Reply",
        type: "Comments",
        text: "this is some text",
    }, {
        id: "Template_2",
        title: "User Story",
        type: "Agile",
        text: "this is some more text",
    }]
};