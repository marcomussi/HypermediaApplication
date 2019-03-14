function addFirstParagraph(paragraph) {
    $("#first_paragraph").append(
        `${paragraph.firstParagraph}`);
}

function addSecondParagraph(paragraph) {
    $("#second_paragraph").append(
        `${paragraph.secondParagraph}`);
}

function addPanelImage(paragraph) {
    $("#panel").append(
        `<div class="row"><div class="col-md-4 col-lg-4 col-sm-4 col-xs-4"><img src="../assets/img/${paragraph.imageurl}" width="100%" height="100%"></div><div class="col-md-8 col-lg-8 col-sm-8 col-xs-8" class="text-center"><p><a href="mailto:"${paragraph.mail}" style="word-wrap: break-word;">${paragraph.mail}</a></p><b>Phone:</b><p><a href="${paragraph.phone}">${paragraph.phone}</a></p></div></div>`);
}

function addEndImage(paragraph) {
    $("#end_image").append(
        `<img src="../assets/img/${paragraph.endimageurl}" width="100%" height="100%">`)
}

function startup() {
    fetch('/who_we_are')
        .then(function (response) {
            return response.json();
        })
        .then(function (whoWeAreData) {
            //this function calls the other functions already defined, that append in the html the data contained in locations database. 
            addFirstParagraph(whoWeAreData[0]);
            addSecondParagraph(whoWeAreData[0]);
            addPanelImage(whoWeAreData[0]);
            addEndImage(whoWeAreData[0]);
        });

}

$(document).ready(function () {
    startup();
})
