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
        title: "Support Reply (HTML)",
        type: "Comments",
        text: "this is some text",
    }, {
        id: "Template_2",
        title: "User Story (Markup)",
        type: "Agile",
        text: "*As a* \n*I want* \n*So that* ",
    }, {
        id: "Template_3",
        title: "Acceptance Criteria (Markup)",
        type: "Agile",
        text: "*Acceptance Criteria*\n* \n*"
    }, {
        id: "Template_4",
        title: "Gherkin - GWT (Markup)",
        type: "Agile",
        text: "_Given_ \n_When_ \n_Then_ "
    }, {
        id: "Template_5",
        title: "Feature Template - (HTML)",
        type: "Agile",
        text: "<p><strong>Summary:</strong><br><em>&gt;&gt; What problem is it solving/what is the objective?</em><br>This feature will…</p><p><br></p><p><strong>Personas:</strong><br><em>&gt;&gt; Who is it solving a problem for/who benefits from it? Remember there are 4 types of personas: Primary, Secondary, Tertiary, Facilitators.</em></p><ul class='ak-ul'><li><p>.</p></li><li><p>.</p></li></ul><p><br></p><p><strong>Scope:</strong><br><em>&gt;&gt; When does it solve the problem? Where does it solve the problem? How often does it solve the problem? What is the context of the change?</em></p><ul class='ak-ul'><li><p>.</p></li><li><p>.</p></li></ul><p><br></p><p><strong>Benefits:</strong><br><em>&gt;&gt; Once the problem has been solved what difference will we see?</em></p><ul class='ak-ul'><li><p>.</p></li><li><p>.</p></li></ul><p><br></p><p><strong>Acceptance Criteria:</strong><br><em>&gt;&gt; What makes it the solution right (not just done, but done right)?</em></p><ul class='ak-ul'><li><p>.</p></li><li><p>.</p></li></ul><p><br></p><p><strong>Assumptions:</strong><br><em>&gt;&gt; What can we take for granted?</em></p><ul class='ak-ul'><li><p>.</p></li><li><p>.</p></li></ul><p><br></p><p><strong>Risks:</strong><br><em>&gt;&gt; What <u>could</u> go wrong?</em></p><ul class='ak-ul'><li><p>.</p></li><li><p>.</p></li></ul><p><br></p><p><strong>Planned Start/End Date/Milestones:</strong><br><em>&gt;&gt; Used for high-level planning, portfolio alignment, capacity planning etc.</em></p><p><br></p><p><strong>Estimated Size:</strong><br><em>&gt;&gt; T-Shirt sizes, e.g. S=~2 weeks, M=~1 month, L=~3 months (and if required XL= ~6 months)</em></p><p><br></p>"
    }]
};