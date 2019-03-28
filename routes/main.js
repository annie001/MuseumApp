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
        // read from dropdowns
        const collection = req.body.collectionName == 'All' ? '(select collection_name from Collection)' : `('${req.body.collectionName}')`;
        const habitat = req.body.habitatName == 'All' ? '(select habitat_name from Habitat)' : `('${req.body.habitatName}')`;
        const institution = req.body.institutionName == 'All' ? '(select institution_name from Institution)' : `('${req.body.institutionName}')`;
        var type = 'Specimen';
        if (req.body.specimenType == 'Animal') type = 'Animal_Specimen';
        if (req.body.specimenType == 'Plant') type = 'Plant_Specimen';

        //TODO: checkbox fields
        // read from checkboxes
        var cols = '';
        //fields from Specimen table
        cols += req.body.selectSpecimenID ? ', s.specimen_ID' : '';
        cols += req.body.selectCommonName ? ', s.Common_name' : '';
        cols += req.body.selectScientificName ? ', s.Scientific_name' : '';
        cols += req.body.selectCollectionName ? ', s.Collection_name' : '';
        cols += req.body.selectStorageRoom ? ', s.Storage_room' : '';
        cols += req.body.selectStorageContainerNum ? ', s.Storage_container_number' : '';
        //institution info
        cols += req.body.selectInstitution ? ', s.Institution_name' : '';
        cols += req.body.selectInstitutionAddress ? ', i.address Institution_address' : '';
        //habitat info
        cols += req.body.selectHabitatName ? ', s.Habitat_name' : '';
        cols += req.body.selectHabitatRegion ? ', r.region' : '';
        //region
        cols += req.body.selectRegionAvgPrecip ? ', r.average_precip_mm' : '';
        cols += req.body.selectRegionAvgTemp ? ', r.average_temp_c' : '';
        // collection
        cols += req.body.selectCurator ? ', c.curator' : '';
        // phylum
        cols += req.body.selectPhylum ? ', p.phylum' : '';

        console.log("got colums");

        if (cols != '') {
            cols = cols.substring(1, cols.length);

            //create a view for all phylums
            const all_phylum_view = 'create view all_phylum(Specimen_ID, phylum)' +
                ' as (select Specimen_ID, animal_phylum_scientific_name as phylum from Animal_Specimen) ' +
                'union (select Specimen_ID, plant_phylum_scientific_name as phylum from Plant_Specimen);';
            connection.query(all_phylum_view, (err, rows, fields) => {
                if (err) {
                    console.log("Failed to create phylum view: " + err);
                    res.sendStatus(500);
                    return;
                }
                console.log("phylum view created");
            });

            // query the database with user inputs
            const query = `select ${cols} from Specimen s, Habitat h, Institution i, Region r, Collection c, all_phylum p
                        where s.Institution_name = i.Institution_name
                        and s.Habitat_name = h.Habitat_name
                        and h.region = r.region
                        and s.Collection_name = c.collection_name
                        and p.Specimen_ID = s.Specimen_ID
                        and s.collection_name in ${collection}
                        and s.habitat_name in ${habitat}
                        and s.institution_name in ${institution}
                        and s.specimen_ID in (select specimen_ID from ${type})`;

            console.log(query);
            connection.query(query, (err, rows, fields) => {
                if (err) {
                    console.log("Failed to query in onSubmit: " + err);
                    res.sendStatus(500);
                    return;
                }

                console.log("onSubmit Success");
                if (rows[0] != null) {

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
            // drop the phylum view 
            const drop = 'drop view all_phylum;'
            connection.query(drop);
        } else {
            res.render('index.ejs', {
                headers: [],
                rows:[]
            });
        }
        console.log("end of submit");

    },

    getAdminPage: function (req, res) {
        const connection = getConnection();
        const sql = "SELECT * FROM Specimen"; // default

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

        const id = req.body.updateSID;
        const newCommonName = req.body.nCName;
        const newScientificName = req.body.nSName;

        const sql = `UPDATE Specimen 
                    SET common_name = '${newCommonName}',
                        scientific_name = '${newScientificName}' 
                    WHERE specimen_ID = '${id}'`;

        queryDb(connection, sql, "Update", "Specimen", res, function () {
            res.redirect("/admin");
        });
    },

    onInsert: function (req, res) {
        const connection = getConnection();

        const id = generateSpecimenId();
        const commonName = req.body.cName;
        const scientificName = req.body.sName;
        const collectionName = req.body.collectionName;
        const dateCollected = req.body.dateCollected;
        const institutionName = req.body.institutionName;
        const habitatName = req.body.habitatName;
        const storageRoom = req.body.storageRoom;
        const storageContainerNumber = req.body.storageContainerNumber;
        const specimenType = req.body.specimenType;

        const specimenSql = `INSERT INTO Specimen 
            (specimen_id, common_name, scientific_name, 
            collection_name, institution_name, date_collected,
            habitat_name, storage_room, storage_container_number) 
            VALUES ('${id}', '${commonName}', '${scientificName}', 
                    '${collectionName}', '${institutionName}', '${dateCollected}', 
                    '${habitatName}', '${storageRoom}', ${storageContainerNumber})`;

        queryDb(connection, specimenSql, "Insert", "Specimen", res, function () {
            if (specimenType === 'Animal') {
                const invertebrate = !!(req.body.invertebrate);
                const typeOfEater = req.body.typeOfEater;
                const locomotion = req.body.locomotion;
                const animalPhylum = req.body.animalPhylum;

                const animalSql = `INSERT INTO Animal_Specimen 
                    (specimen_id, invertebrate, type_of_eater, 
                    locomotion, animal_phylum_scientific_name)
                    VALUES ('${id}', ${invertebrate}, '${typeOfEater}',
                            '${locomotion}', '${animalPhylum}')`;

                queryDb(connection, animalSql, "Insert", "Animal_Specimen", res);
            } else if (specimenType === 'Plant') {
                const leaves = !!(req.body.leaves);
                const roots = !!(req.body.roots);
                const stems = !!(req.body.stems);
                const plantPhylum = req.body.plantPhylum;

                const plantSql = `INSERT INTO Plant_Specimen 
                    (specimen_id, leaves, roots, stems, 
                    plant_phylum_scientific_name) 
                    VALUES ('${id}', ${leaves}, ${roots}, ${stems},
                            '${plantPhylum}')`;

                queryDb(connection, plantSql, "Insert", "Plant_Specimen", res);
            }

            res.redirect("/admin");
        });
    },

    onDelete: function (req, res) {
        const connection = getConnection();

        const id = req.body.deleteSID;

        const sql = `DELETE from Specimen WHERE specimen_ID = '${id}'`;

        queryDb(connection, sql, "Delete", "Specimen", res, function () {
            res.redirect("/admin");
        });
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

function queryDb(connection, sql, operation, tableName, res, callback) {
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            const errMsg = `Failed to ${operation} for ${tableName} table: ${err}`;
            console.log(errMsg);
            res.status(500).send(errMsg);
            return;
        }

        console.log(`on${operation} ${tableName} Success`);

        if (callback) {
            return callback();
        }
    });
}