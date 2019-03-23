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
        console.log("update here");
        const connection = getConnection();

        let id = req.body.updateSID;
        let newCommonName = req.body.nCName;
        let newScientificName = req.body.nSName;

        const sql = `UPDATE Specimen SET common_name = '${newCommonName}', scientific_name = '${newScientificName}' WHERE specimen_ID = '${id}'`;

        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onUpdate: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onUpdate Success");
            res.redirect("/admin");
        })
    },

    // TODO
    onInsert: function (req, res) {
        const connection = getConnection();

        let id = generateSpecimenId();
        const commonName = req.body.cName;
        const scientificName = req.body.sName;
        const collectionName = req.body.collectionName;
        const institutionName = req.body.institutionName;
        const habitatName = req.body.habitatName;
        const storageRoom = req.body.storageRoom;
        const storageContainerNumber = req.body.storageContainerNumber;
        const specimenType = req.body.specimenType;

        const specimenSql = `INSERT INTO Specimen (specimen_id, common_name, scientific_name, collection_name, 
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

        if (specimenType === 'Animal') {
            const invertebrate = req.body.invertebrate;
            const typeOfEater = req.body.typeOfEater;
            const locomotion = req.body.locomotion;
            const animalPhylum = req.body.animalPhylum;

            const animalSql = `INSERT INTO Animal_Specimen (specimen_id, invertebrate, type_of_eater, locomotion,
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
        } else if (specimenType === 'Plant') {
            let leaves = req.body.leaves;
            let stems = req.body.stems;
            let plantPhylum = req.body.plantPhylum;

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
            });
        } else { // specimenType === 'None'
            // do nothing
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

function generateSpecimenId() {
    return Math.random().toString(36).substring(2, 7);
}