const mysql = require("mysql");

module.exports = {
    getMain: function (req, res) {
        const connection = getConnection();
        const sql = "SELECT * FROM Collection";

        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in getMain: " + err);
                res.sendStatus(500);
                return;
            }

            let header = Object.keys(rows[0]);
            console.log("getMain Success");

            res.render('index.ejs', {
                headers: header,
                rows
            });
        })
    },

    onSubmit: function (req, res) {
        const connection = getConnection();
        const sql =  "SELECT * FROM Specimen";
        console.log(req);
        console.log(req.body);
        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onSubmit: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onSubmit Success");
            let header = Object.keys(rows[0]);
            res.render('index.ejs', {
                headers: header,
                rows
            });
        })
    },

    getAdminPage: function (req, res) {
        const connection = getConnection();
        const sql = "SELECT * FROM Specimen"; // default since admin can only modify specimen

        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in getAdminPage: " + err);
                res.sendStatus(500);
                return;
            }

            let header = Object.keys(rows[0]);
            console.log("getAdminPage Success");

            res.render('adminPage.ejs', {
                headers: header,
                rows
            });
        })
    },

    // TODO
    onUpdate: function (req, res) {
        const connection = getConnection();

        let id = req.body.updateSID;
        let oldCommonName = req.body.oCName;
        let newCommonName = req.body.nCName;
        let oldScientificName = req.body.oSName;
        let newScientificName = req.body.nSName;

        const sql = `UPDATE Specimen SET common_name = ${newCommonName}, scientific_name = ${newScientificName} WHERE specimen_ID = ${id} `;

        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onUpdate: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onUpdate Success");
            let header = Object.keys(rows[0]);
            res.redirect("/admin");
        })
    },

    // TODO
    onInsert: function (req, res) {
        const connection = getConnection();

        let id = req.body.insertSID; // randomly generate numbers instead?
        let commonName = req.body.cName;
        let scientificName = req.body.sName;
        let collectionName = req.body.collectionName;
        let institutionName = req.body.institutionName;
        let habitatName = req.body.habitatName;
        let storageRoom = req.body.storageRoom;
        let storageContainerNumber = req.body.storageContainerNumber;

        // animal
        let invertebrate = req.body.invertebrate;
        let typeOfEater = req.body.typeOfEater;
        let locomotion = req.body.locomotion;
        let animalPhylum = req.body.animalPhylum;

        // plant
        let leaves = req.body.leaves;
        let stems = req.body.stems;
        let plantPhylum = req.body.plantPhylum;

        // none of the animal or plant fields are currently required
        const isAnimal = !!(invertebrate && typeOfEater && locomotion && animalPhylum);

        let specimenSql = `INSERT INTO Specimen (specimen_id, common_name, scientific_name, collection_name, 
            institution_name, habitat_name, storage_room, storage_container_number) 
            VALUES (${id}, ${commonName}, ${scientificName}, 
                ${collectionName}, ${institutionName}, ${habitatName}
                ${storageRoom}, ${storageContainerNumber})`;


        connection.query(specimenSql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onInsert Specimen: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onInsert Specimen Success");
            let header = Object.keys(rows[0]);
            res.redirect("/admin");
        });

        if (isAnimal) {
            // insert into Animal_specimen
            let animalSql = `INSERT INTO Animal_Specimen (specimen_id, invertebrate, type_of_eater, locomotion,
                animal_phylum_scientific_name)
                VALUES (${id}, ${invertebrate}, ${typeOfEater}, ${locomotion}, ${animalPhylum})`;

            connection.query(animalSql, (err, rows, fields) => {
                if (err) {
                    console.log("Failed to query in onInsert Animal: " + err);
                    res.sendStatus(500);
                    return;
                }
    
                console.log("onInsert Animal Success");
                let header = Object.keys(rows[0]);
                res.redirect("/admin");
            });
        } else {
            // insert into Plant_specimen
            let plantSql = `INSERT INTO Plant_Specimen (specimen_id, leaves, stems, plant_phylum_scientific_name) 
                VALUES (${id}, ${leaves}, ${stems}, ${plantPhylum})`;

            connection.query(plantSql, (err, rows, fields) => {
                if (err) {
                    console.log("Failed to query in onInsert Plant: " + err);
                    res.sendStatus(500);
                    return;
                }
    
                console.log("onInsert Plant Success");
                let header = Object.keys(rows[0]);
                res.redirect("/admin");
            })
        }
    },

    // TODO
    onDelete: function (req, res) {
        const connection = getConnection();

        let id = req.body.deleteSID;

        const sql = `DELETE from Specimen WHERE specimen_ID = ${id} `;

        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onDelete: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onDelete Success");
            let header = Object.keys(rows[0]);
            res.redirect("/admin");
        })
    }
};

function getConnection() {
    return mysql.createConnection({
        host: "35.197.31.16",
        user: "root",
        password: "cpsc304",
        database: "museum"
    });
}