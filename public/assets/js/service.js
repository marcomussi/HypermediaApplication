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
    let responsibleName;
    let sData;
    fetch(`/service?id=${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (servicesData) {
            //prints the datas that don't contain links to other entities
            sData = servicesData[0];
            $("#title").append(`${sData.title}`);
            $("#desc").append(`${sData.description}`);
            $("#pain_relief").append(`${sData.painRelief}`);
            $("#service_img").append(`<img src="../assets/img/services/${sData.image}" width="100%">`);

        }).then(function () {
            //gets the datas of the responsible doctor
            fetch(`/doctor?id=${sData.responsible_doctor_id}`)
                .then(function (response) {
                    return response.json();
                }).then(function (responsibleDoctorData) {
                    //shows a link to the responsible doctor
                    rData = responsibleDoctorData[0];
                    responsibleName = rData.name;
                    $("#responsible").append(`<a href="doctor.html?id=${sData.responsible_doctor_id}">${responsibleName}</a>`);
                })
        }).then(function () {
            //gets the data of the location in which the service is performed
            fetch(`/location?id=${sData.location}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (locsData) {
                    //shows a link to the location
                    locationData = locsData[0];
                    $("#location").append(`<a href="location.html?id=${sData.location}">${locationData.title} </a>`);
                });
        });


    //retrieves the list of doctors that perform this service
    fetch(`/doctors_in_service?serviceId=${id}`)
        .then(function (response) {
            return response.json();
        }).then(function (doctorsInTheService) {
            for (doctor of doctorsInTheService) {
                $("#doctors_in_the_service").append(`<a class="list-group-item" href="doctor.html?id=${doctor.id}">${doctor.name}</a>`);
            }
        })
}


$(document).ready(function () {
    startup();
})
