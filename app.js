const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {getMain, onSubmit, getAdminPage, onUpdate, onInsert, onDelete} = require("./routes/main");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use("/public", express.static("public"));

// typical user filter search
app.post("/submit", onSubmit);

// default main page
app.get("/", getMain);

// admin page 
app.get("/admin", getAdminPage);

// admin update
app.post("/update", onUpdate);

// admin insertion
app.post("/insert", onInsert);

// admin deletion
app.post("/delete", onDelete);

app.listen(3010, () => {
    console.log("server is running");
})
