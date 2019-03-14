//extracts the chosen parameter from the query in the url
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function startup() {
    //this function fill the Service menù of form with dynimic data from service database
    let id = getParameterByName('id');
    if (id == null) id = 1;
    fetch('/all_services')
        .then(function (response) {
            return response.json();
        })
        .then(function (servicesData) {

            for (s of servicesData) {
                $("#selectService").append(`<option>${s.title}</option>`);
            }
        });
}

function confirm() {
    //return a message in case of successfully request

    window.alert("Successfully booked!");
}

function canceled() {
    //return a message in case of error in the request
    window.alert("Error!");
}

function submitForm() {
    //declares headers and formdata that are used from the POST method of fetch to insert form's data in bookings database
    let headers = new Headers();
    headers.set("Content-Type", "application/json");

    let formdata = formDataAsJSON(new FormData(
        document.getElementById("booking_form")
    ));

    fetch("/bookings", {
            method: "POST",
            body: formdata,
            headers: headers
        }).then(response =>
            response.json())
        .then(response => {
            console.log(response);
            if (response.error === "400") {
                canceled();
            } else {
                confirm();
            }
        }, response => {
            console.log(response);
        });
}



function formDataAsJSON(formData) {
    let x = {};
    for (var pair of formData.entries()) {
        x[pair[0]] = pair[1];
    }
    return JSON.stringify(x);
}

$(document).ready(function () {
    startup();
    $("#submit").on("click", function (e) {
        e.preventDefault();
        submitForm();
    })
})
