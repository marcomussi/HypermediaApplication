function addRow(q) {
    // append html code with dynamic data
    $("#dynamicData").append(
        `<div><h4>${q.question}</h4></div><div>${q.answer}</div>`);

}

function startup() {
    fetch('/faq')
        .then(function (response) {
            return response.json();
        })
        .then(function (faqData) {
            //for all objects in the set "faqData" call addRow function
            for (question of faqData) {
                addRow(question);
            }
        });

}

$(document).ready(function () {
    startup();
})
