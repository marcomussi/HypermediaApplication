//fill the left table with data from doctors with even id
function addRowLeft(doctor) {
    $("#d_rowsLeft").append(
        `<tr class="tabRow"><td width="15%"><img src="../assets/img/doctors/${doctor.imageurl}" height="auto" width="100%"></td><td width="85%"><table id="doctorsInfo" cellpadding="10" cellspacing="10"><tr id="doctorName"><td><a href="doctor.html?id=${doctor.id}"><font size="4">${doctor.name}</font></a></td></tr><tr id="doctorSpec"><td><font size="3">${doctor.spec}</font></td></tr></table></td></tr>`);

}

//fill the right table with data from doctors with odd id
function addRowRight(doctor) {
    $("#d_rowsRight").append(
        `<tr class="tabRow"><td width="15%"><img src="../assets/img/doctors/${doctor.imageurl}" height="auto" width="100%"></td><td width="85%"><table id="doctorsInfo" cellpadding="10" cellspacing="10"><tr id="doctorName"><td><a href="doctor.html?id=${doctor.id}"><font size="4">${doctor.name}</font></a></td></tr><tr id="doctorSpec"><td><font size="3">${doctor.spec}</font></td></tr></table></td></tr>`);
}

function startup() {
    fetch('/all_doctors')
        .then(function (response) {
            return response.json();
        })
        .then(function (doctorsData) {
            $("#d_rowsLeft").find("tr").remove(); //remove all the tr in div with d_rowsLeft id
            $("#d_rowsRight").find("tr").remove(); //remove all the tr in div with d_rowsRight id
            var counter = 0;
        // for all objects in the set doctorsData call relative funtion to fill html code
            for (d of doctorsData) {
                if (counter % 2 == 0)
                    addRowLeft(d);
                else
                    addRowRight(d);
                counter++;
            }
        });

}


$(document).ready(function () {
    startup();
})
