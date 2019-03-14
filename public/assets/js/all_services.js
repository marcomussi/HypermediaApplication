function addRow(service) {
    //adds a row to the table of the services.
    //Each row contains the name of the service, linked to the page of that service
    $("#s_rows").append(
        `<tr class="info"><td>${service.id}</td><td><a href="service.html?id=${service.id}">${service.title}</a></td></tr>`);
}

function startup() {
    //fetches list of all the services from the server
    fetch('/all_services')
        .then(function (response) {
            return response.json();
        })
        .then(function (servicesData) {
            $("#s_rows").find("tr").remove();

            for (s of servicesData) {
                //adds each service in the table
                addRow(s);
            }
        });

}


$(document).ready(function () {
    startup();
})
