const mysql = require("mysql");

let collectionInfoQuery = `
    SELECT 
        s.Collection_name as collectionName,
        COUNT(*) as totalSpecimen,
        AVG(r.average_precip_mm) as avgPrecipitation,
        AVG(r.average_temp_c) as avgTemp
    from Specimen AS s 
    INNER JOIN Habitat AS h ON h.habitat_name = s.Habitat_name
    INNER JOIN Region AS r ON r.region = h.region
    GROUP BY s.Collection_name
    ORDER BY avgPrecipitation DESC, avgTemp
    `;
let collectionInfoHeaders = "Collection Name, Total Specimen, Average Precipitation (mm), Average Temperature (c)";
let collectionInfoKeys = ["collectionName", "avgPrecipitation", "avgPrecipitation", "avgTemp"];
let collectionInfoTitle = "Statistics For Each Collection";


let institutionInfoQuery = `
    select 
        i.institution_name as institutionName,
        count(*) as totalSpecimen
    from Specimen AS s
    INNER JOIN Institution AS i ON s.Institution_name = i.institution_name
    GROUP BY s.Institution_name
    ORDER BY totalSpecimen DESC
    `;
let institutionInfoHeaders = "Institution Name, Total Specimen";
let institutionInfoKeys = ["institutionName", "totalSpecimen"];
let institutionInfoTitle = "Total Specimen Collected By Each Institution";


let storageRoomInfoQuery = `
    SELECT 
        s.Storage_room as storageRoom,
        COUNT(psp.Specimen_ID) as plantCount,
        COUNT(asp.Specimen_ID) as animalCount
    FROM Specimen AS s
    LEFT JOIN Plant_Specimen as psp ON psp.Specimen_ID = s.specimen_ID
    LEFT JOIN Animal_Specimen as asp ON asp.Specimen_ID = s.specimen_ID
    GROUP BY s.Storage_room;
    `;
let storageRoomInfoHeaders = "Storage Room, Plant Specimen Count, Animal Specimen Count";
let storageRoomInfoKeys = ["storageRoom", "plantCount", "animalCount"];
let storageRoomInfoTitle = "Specimen Count For Each Storage Room";


let allPlantsCollectionQuery = `
    SELECT c.collection_name as collectionName
    FROM Collection c
    WHERE NOT EXISTS (
        SELECT p.Specimen_ID FROM Plant_Specimen p
        WHERE NOT EXISTS (
            SELECT s.specimen_ID FROM Specimen s
            WHERE s.Collection_name = c.collection_name
            AND p.Specimen_ID = s.specimen_ID
        )
    );`;
let allPlantsCollectionHeaders = "Collection Name";
let allPlantsCollectionKeys = ["collectionName"];
let allPlantsCollectionTitle = "Collections Containing All Plant Specimen";

let regionsContainingSpecimenQuery = `
    SELECT r.region as regionName, COUNT(s.Habitat_name) as numSpecimen
    FROM Region r, Specimen s
    WHERE EXISTS (
        SELECT * FROM Habitat h
        WHERE s.Habitat_name = h.habitat_name AND h.region = r.region
    )
    GROUP BY r.region
    ORDER BY regionName
    `;
let regionsContainingSpecimenHeaders = "Region Name, Specimen Count";
let regionsContainingSpecimenKeys = ["regionName", "numSpecimen"];
let regionsContainingSpecimenTitle = "Regions Containing Specimens and Specimen Count Of Each";

module.exports = {
    getReport: async function (req, res) {
        let csvStr = '';
        let dateToAppend = getDateToBeAppended();
        downloadCollectionInfo()
            .then((csvStr) => {
                return downloadInstitutionInfo(csvStr);
            })
            .then((csvStr) => {
                return downloadStorageRoomInfo(csvStr);
            })
            .then((csvStr) => {
                return downloadAllPlantsCollection(csvStr);
            })
            .then((csvStr) => {
                return downloadRegionsContainingSpecimen(csvStr);
            })
            .then((csvStr) => {
                res.setHeader('Content-disposition', 'attachment; filename=Report' + dateToAppend + '.csv');
                res.set('Content-Type', 'text/csv');
                res.status(200).send(csvStr);
            })
            .catch(err => {
                console.log("Failed to query database: " + err);
                res.sendStatus(500);
                return;
            });
    }
}

function addDataToCsv (headers, rows, keys, result, title) {
    let columnDelimiter = ',';
    let lineDelimiter = '\n';

    if (rows == null || !rows.length) {
        return null;
    }

    result += title;
    result += lineDelimiter;
    result += headers;
    result += lineDelimiter;

    rows.forEach(function(row) {
        let count = 0;
        keys.forEach(function(key) {
            if (count > 0) {
                result += columnDelimiter;
            }

            result += row[key];
            count++;
        });
        result += lineDelimiter;
    });
    result += lineDelimiter;
    result += lineDelimiter;
    return result;
}

function getDateToBeAppended() {
    let d = new Date(Date.now());
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let year = d.getFullYear();
    return '-' + month + '-' + day + '-' + year;
}

function downloadCollectionInfo (csvStr) {
    let connection = getConnection();
    let sql = collectionInfoQuery;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows, fields) => {
            let ret = addDataToCsv (collectionInfoHeaders, rows, collectionInfoKeys, csvStr, collectionInfoTitle);
            resolve(ret);
        })
    });
}

function downloadInstitutionInfo (csvStr) {
    let connection = getConnection();
    let sql = institutionInfoQuery;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows, fields) => {
            let ret = addDataToCsv (institutionInfoHeaders, rows, institutionInfoKeys, csvStr, institutionInfoTitle);
            resolve(ret);
        })
    });
}


function downloadStorageRoomInfo (csvStr) {
    let connection = getConnection();
    let sql = storageRoomInfoQuery;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows, fields) => {
            let ret = addDataToCsv (storageRoomInfoHeaders, rows, storageRoomInfoKeys, csvStr, storageRoomInfoTitle);
            resolve(ret);
        })
    });
}

function downloadAllPlantsCollection (csvStr) {
    let connection = getConnection();
    let sql = allPlantsCollectionQuery;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows, fields) => {
            let ret = addDataToCsv (allPlantsCollectionHeaders, rows, allPlantsCollectionKeys,
                csvStr, allPlantsCollectionTitle);
            resolve(ret);
        })
    });
}

function downloadRegionsContainingSpecimen (csvStr) {
    let connection = getConnection();
    let sql = regionsContainingSpecimenQuery;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows, fields) => {
            let ret = addDataToCsv (regionsContainingSpecimenHeaders, rows, regionsContainingSpecimenKeys,
                csvStr, regionsContainingSpecimenTitle);
            resolve(ret);
        })
    });
}


function getConnection() {
    return mysql.createConnection({
        host: "35.197.31.16",
        user: "root",
        password: "cpsc304",
        database: "museum"
    });
}