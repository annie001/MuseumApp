const mysql = require("mysql");

module.exports = {
    getMain: function (req, res) {
        const connection = getConnection();
        const sql = "SELECT * FROM Name";

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
        const sql = "SELECT first_name, last_name FROM Name";

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
        const sql = "SELECT * FROM Name";

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

        let id = req.body.id;
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
    }
};

function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "mysql123",
        database: "museum"
    });
}