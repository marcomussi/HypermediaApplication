function getParameterByName(name, url) {
    //extracts the chosen parameter from the query in the url
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function startup() {
    //pupulates the list of the locations
    fetch('/all_locations')
        .then(function (response) {
            return response.json();
        })
        .then(function (locationsData) {

            for (l of locationsData) {
                $("#locations").append(`<a class="list-group-item" href="doctors_by_location.html?id=${l.id}">${l.title}</a>`);
            }
        });
    loadDoctors();
}

// append html code with dynamic data
function addRow(doctor) {
    $("#d_rows").append(
        `<tr class="tabRow"><td width="15%"><img src="../assets/img/doctors/${doctor.imageurl}" height="auto" width="100%"></td><td width="85%"><table id="doctorsInfo" cellpadding="10" cellspacing="10"><tr id="doctorName"><td><a href="doctor.html?id=${doctor.id}"><font size="4">${doctor.name}</font></a></td></tr><tr id="doctorSpec"><td><font size="3">${doctor.spec}</font></td></tr></table></td></tr>`);
}

function loadDoctors() {
    //reads the location id in the URL's query and loads the doctors in that location
    let locId = getParameterByName('id');
    if (locId == null) id = 1;
    fetch(`/doctors_by_location?id=${locId}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (doctorsData) {
            $("#d_rows").find("tr").remove();
            for (d of doctorsData) {
                addRow(d);
            }

        });
}

$(document).ready(function () {
    startup();

})
