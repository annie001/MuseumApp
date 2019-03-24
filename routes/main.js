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
        // TODO: If user input is "All"
        const connection = getConnection();
        const sql =  "SELECT * FROM Specimen";
        const collection = req.body.collectionName;
        //const sType = req.body.sType;
        const habitat = req.body.habitatName;
        const institution = req.body.institutionName;
        const query = `select * from Specimen 
                        where collection_name = '${collection}' 
                        and habitat_name = '${habitat}' 
                        and institution_name = '${institution}'`;
        //TODO: checkbox fields
        console.log(query);
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onSubmit: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onSubmit Success");
            if (rows[0] != null){

                let header = Object.keys(rows[0]);
                res.render('index.ejs', {
                    headers: header,
                    rows
                });
            } else {
                res.render('index.ejs', {
                    headers: [],
                    rows
                });
            }
            
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

    onUpdate: function (req, res) {
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

    // WIP
    onInsert: function (req, res) {
        const connection = getConnection();

        let id = generateSpecimenId();
        const commonName = req.body.cName;
        const scientificName = req.body.sName;
        const collectionName = req.body.collectionName;
        const dateCollected = req.body.dateCollected;
        const institutionName = req.body.institutionName;
        const habitatName = req.body.habitatName;
        const storageRoom = req.body.storageRoom;
        const storageContainerNumber = req.body.storageContainerNumber;
        const specimenType = req.body.specimenType;

        const specimenSql = `INSERT INTO Specimen (specimen_id, common_name, scientific_name, collection_name, 
            institution_name, date_collected, habitat_name, storage_room, storage_container_number) 
            VALUES ('${id}', '${commonName}', '${scientificName}', 
                '${collectionName}', '${institutionName}', '${dateCollected}', 
                '${habitatName}', '${storageRoom}', '${storageContainerNumber}')`;

        connection.query(specimenSql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onInsert Specimen: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onInsert Specimen Success");
            res.redirect("/admin");
        });

        if (specimenType === 'Animal') {
            console.log("invertebrate ", req.body.invertebrate);
            const invertebrate = req.body.invertebrate ? 1 : 0;
            console.log(invertebrate);
            const typeOfEater = req.body.typeOfEater;
            const locomotion = req.body.locomotion;
            const animalPhylum = req.body.animalPhylum;

            const animalSql = `INSERT INTO Animal_Specimen (specimen_id, invertebrate, type_of_eater, locomotion,
                animal_phylum_scientific_name)
                VALUES ('${id}', '${invertebrate}', '${typeOfEater}', '${locomotion}', '${animalPhylum}')`;

            connection.query(animalSql, (err, rows, fields) => {
                if (err) {
                    console.log("Failed to query in onInsert Animal: " + err);
                    res.sendStatus(500);
                    return;
                }
    
                console.log("onInsert Animal Success");
                // let header = Object.keys(rows[0]);
                res.redirect("/admin");
            });
        } else if (specimenType === 'Plant') {
            let leaves = req.body.leaves ? 1 : 0;
            let stems = req.body.stems ? 1 : 0;
            let roots = req.body.roots ? 1 : 0;
            let plantPhylum = req.body.plantPhylum;


            let plantSql = `INSERT INTO Plant_Specimen (specimen_id, leaves, roots, stems, plant_phylum_scientific_name) 
                VALUES ('${id}', '${leaves}', '${roots}', '${stems}', '${plantPhylum}')`;

            connection.query(plantSql, (err, rows, fields) => {
                if (err) {
                    console.log("Failed to query in onInsert Plant: " + err);
                    res.sendStatus(500);
                    return;
                }
    
                console.log("onInsert Plant Success");
                res.redirect("/admin");
            });
        } else { // specimenType === 'None'
            // do nothing
        };
    },

    onDelete: function (req, res) {
        const connection = getConnection();

        const id = req.body.deleteSID;

        const sql = `DELETE from Specimen WHERE specimen_ID = '${id}'`;

        connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("Failed to query in onDelete: " + err);
                res.sendStatus(500);
                return;
            }

            console.log("onDelete Success");
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