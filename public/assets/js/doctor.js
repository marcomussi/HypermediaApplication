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
    let id = getParameterByName('id');
    let locationId;
    let serviceId;
    fetch(`/doctor?id=${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (doctorsData) {
            //fill html code with doctor's dynamic data
            let dData = doctorsData[0];
            $("#name").append(`${dData.name}`);
            $("#spec").append(`${dData.spec}`);
            locationId = dData.location;
            serviceId = dData.service_id;
            $("#first_paragraph").append(`${dData.paragraph1}`);
            $("#second_paragraph").append(`${dData.paragraph2}`);
            $("#imageurl").append(`<img src="../assets/img/doctors/${dData.imageurl}" width="100%">`);
        })
        .then(function () { 
        // get the name of the location in which doctor works starting from the location identifier
            fetch(`/location?id=${locationId}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (locationsData) {
                    let locData = locationsData[0];
                    $("#location").append(`<a href="location.html?id=${locationId}">${locData.title}</a>`);
                });
        })
        .then(function () { 
        // get the name of the service in which doctor is specialized starting from the service identifier
            fetch(`/service?id=${serviceId}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (servicesData) {
                    let servData = servicesData[0];
                    $("#service").append(`<a href="service.html?id=${serviceId}">${servData.title}</a>`);
                    if (servData.responsible_doctor_id == id) {
                        $("#responsible").append(`Responsible of the Service`);
                    }
                });
        })
}


$(document).ready(function () {
    startup(); //
})
