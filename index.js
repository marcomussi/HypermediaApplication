//associates external modules to variables
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbFactory = require("knex");
const process = require("process");
const _ = require("lodash");
let db;

function initDB() {
    //if the TEST environment variable is TRUE, an SQLite3 databse is used.
    //Otherwiser, a PostGres database is used instead.
    //When testing in local, you should set test=TRUE
    if (process.env.TEST) {
        db = dbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./clinicdb.sqlite"
            }
        });
    } else {
        db = dbFactory({
            debug: true,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
}


function initDoctors() {
    //If the doctors table doesn't exist in the database, creates it and populates it
    //with data parsed from doctorsdata.json
    return db.schema.hasTable("doctors").then(exists => {
        if (!exists) {
            db.schema
                .createTable("doctors", table => {

                    table.increments("id");
                    table.string("name");
                    table.string("spec");
                    table.integer("location");
                    table.text("paragraph1");
                    table.text("paragraph2");
                    table.string("imageurl");
                    table.integer("service_id");
                })
                .then(() => {
                    return Promise.all(
                        _.map(doctorsList, d => {
                            return db("doctors").insert(d);
                        })
                    );
                });
        } else {
            return true;
        }
    });
}


function initFAQ() {
    //If the faq table doesn't exist in the database, creates it and populates it
    //with data parsed from faq.json
    return db.schema.hasTable("faq").then(exists => {
        if (!exists) {
            db.schema
                .createTable("faq", table => {
                    table.text("question");
                    table.text("answer");
                })
                .then(() => {
                    return Promise.all(
                        _.map(faqList, question => {
                            return db("faq").insert(question);
                        })
                    );
                });
        } else {
            return true;
        }
    });
}




function initWhoWeAre() {
    //If the whoweare table doesn't exist in the database, creates it and populates it
    //with data parsed from whowearedata.json
    return db.schema.hasTable("whoweare").then(exists => {
        if (!exists) {
            db.schema
                .createTable("whoweare", table => {
                    table.text("firstParagraph");
                    table.text("secondParagraph");
                    table.string("imageurl");
                    table.string("mail");
                    table.string("phone");
                    table.string("endimageurl");
                })
                .then(() => {
                    return Promise.all(
                        _.map(whoweareList, w => {
                            return db("whoweare").insert(w);
                        })
                    );
                });
        } else {
            return true;
        }
    });
}


function initBookings() {
    //If the bookings table doesn't exist in the database, creates it
    return db.schema.createTableIfNotExists("bookings", table => {
        table.string("email");
        table.string("firstName");
        table.string("lastName");
        table.string("phonePrefix");
        table.string("phoneNumber");
        table.text("insuranceCode");
        table.string("date");
        table.string("selectService");
    }).then(() => {
        return db("bookings");
    });

}

function initLocations() {
    //If the locations table doesn't exist in the database, creates it and populates it
    //with data parsed from locationsdata.json
    return db.schema.hasTable("locations").then(exists => {
        if (!exists) {
            db.schema
                .createTable("locations", table => {
                    table.increments("id");
                    table.string("title");
                    table.text("description");
                    table.string("address");
                    table.string("phone");
                    table.string("imageurl");
                    table.string("imageurl2");
                    table.text("map");
                })
                .then(() => {
                    return Promise.all(
                        _.map(locationsList, l => {
                            delete l.id;
                            return db("locations").insert(l);
                        })
                    );
                });
        } else {
            return true;
        }
    });
}



function initServices() {
    //If the services table doesn't exist in the database, creates it and populates it
    //with data parsed from servicesdata.json
    return db.schema.hasTable("services").then(exists => {
        if (!exists) {
            db.schema
                .createTable("services", table => {
                    table.increments("id");
                    table.string("title");
                    table.text("description");
                    table.text("painRelief");
                    table.string("image");
                    table.string("area");
                    table.string("location");
                    table.integer("responsible_doctor_id");
                })
                .then(() => {
                    return Promise.all(
                        _.map(servicesList, s => {
                            delete s.id;
                            return db("services").insert(s);
                        })
                    );
                });
        } else {
            return true;
        }
    });
}

//tries to get the port from the enviroment useful for heroku), otherwise sets 5000.
let serverPort = process.env.PORT || 5000;

//associate JSON path files to variables
//those variables are used in the functions that initialize tha tables of the db.
let locationsList = require("./other/locationsdata.json");
let servicesList = require("./other/servicesdata.json");
let doctorsList = require("./other/doctorsdata.json");
let whoweareList = require("./other/whoweare.json");
let faqList = require("./other/faq.json");
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// /* Register REST entry point */

//Returns a JSON with all the doctors in the "doctors" table of the db, sorted by name.
app.get("/all_doctors", function (req, res) {
    let myQuery = db("doctors");
    myQuery = myQuery.orderBy("name", "asc");
    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });

});

//Returns data from the 'whoweare' table of the database
app.get("/who_we_are", function (req, res) {

    let myQuery = db("whoweare");

    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });

});

//Returns a JSON with all the faq in the "faq" table of the db
app.get("/faq", function (req, res) {

    let myQuery = db("faq");

    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });

});

//Returns a JSON with all the services in the "services" table of the db
app.get("/all_services", function (req, res) {
    let myQuery = db("services");
    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });

});

//Returns a JSON with all the locations in the "locations" table of the db
app.get("/all_locations", function (req, res) {
    let myQuery = db("locations");
    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });

});

//Returns a JSON with with the datas of the location whose id is specified in the query
app.get("/location", function (req, res) {
    let id = parseInt(_.get(req, "query.id"));
    let myQuery = db("locations");
    myQuery.where({
        id: id
    }).select('title', 'description', 'address', 'phone', 'imageurl', 'imageurl2', 'map').then(result => {
        res.send(JSON.stringify(result));
    })
});

//Returns a JSON with with the datas of the doctor whose id is specified in the query
app.get("/doctor", function (req, res) {
    let id = parseInt(_.get(req, "query.id"));
    let myQuery = db("doctors");
    myQuery.where({
        id: id
    }).select('name', 'spec', 'location', 'paragraph1', 'paragraph2', 'imageurl', 'service_id').then(result => {
        res.send(JSON.stringify(result));
    })
});

//Returns a JSON with with the service of the location whose id is specified in the query
app.get("/service", function (req, res) {
    let id = parseInt(_.get(req, "query.id"));
    let myQuery = db("services");
    myQuery.where({
        id: id
    }).select('title', 'description', 'painRelief', 'image', 'area', 'location', 'responsible_doctor_id').then(result => {
        res.send(JSON.stringify(result));
    })
});

//Returns a JSON with with an array of {id, name} objects of the doctors
//who perform the service whose id is specified in the query
app.get("/doctors_in_service", function (req, res) {
    let servId = parseInt(_.get(req, "query.serviceId"));
    let myQuery = db("doctors");
    myQuery.where({
        service_id: servId
    }).select('id', 'name').then(result => {
        res.send(JSON.stringify(result));
    })
});

//Returns a JSON with with an array of {id, name, spec, imageurl} objects of the doctors
//who operate in a location whose id is specified in the query
app.get("/doctors_by_location", function (req, res) {
    let locId = parseInt(_.get(req, "query.id"));
    let myQuery = db("doctors");
    myQuery.where({
        location: locId
    }).select('id', 'name', 'spec', 'imageurl').then(result => {
        res.send(JSON.stringify(result));
    })
});


//Writes the datas received from the form in the db.
app.post("/bookings", function (req, res) {
    let toappend = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phonePrefix: req.body.phonePrefix,
        phoneNumber: req.body.phoneNumber,
        insuranceCode: req.body.insuranceCode,
        date: req.body.date,
        selectService: req.body.selectService

    };
    db("bookings").insert(toappend).then(ids => {
            let id = ids[0];
            res.send(_.merge({
                id,
                toappend
            }));
        }),
        function (e) {
            res.send("Error!");
            console.log("POST error", e);
        };
});

app.set("port", serverPort);
initDB();
initDoctors();
initWhoWeAre();
initServices();
initBookings();
initLocations();
initFAQ();

/* Start the server on port 5000 */
app.listen(serverPort, function () {
    console.log(`Your app is ready at port ${serverPort}`);
});

//Returns a JSON with al the bookings registered in the db.
app.get("/bookings", function (req, res) {
    let myQuery = db("bookings");
    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });

});
