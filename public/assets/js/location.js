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
    fetch(`/location?id=${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (locationsData) {
            //fill the html code with location's dinamic data
            let lData = locationsData[0];
            $("#title").append(`${lData.title}`);
            $("#desc").append(`${lData.description}`);
            $("#address").append(`${lData.address}`);
            $("#location_img").append(`<img src="../assets/img/locations/${lData.imageurl2}" width="100%" height="auto">`);
            $("#location_img2").append(`<img src="../assets/img/locations/${lData.imageurl}" width="100%" height="auto" >`);
            $("#map").append(`<iframe width="100%" height="450" frameborder="0" style="border:0" src="${lData.map}" allowfullscreen></iframe>`)


        });


}


$(document).ready(function () {
    startup();
})
