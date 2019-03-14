
function addRow(location) {
    //this function adds a row to the all_locations table
    $("#l_rows").append(
        `<tr class="info"><td>${location.id}</td><td><a href="location.html?id=${location.id}">${location.title}</a></td></tr>`);
}

//
function startup() {
    //fetches list of locations from database in the serves
    fetch('/all_locations')
        .then(function (response) {
            return response.json();
        })
        .then(function (locationsData) {
            $("#l_rows").find("tr").remove();

            var counter = 0;
            for (l of locationsData) {
                addRow(l);
                counter++;
            }
        });

}


$(document).ready(function () {
    startup();
})
