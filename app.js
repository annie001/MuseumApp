const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const {getMain, onSubmit, getAdminPage, onUpdate} = require("./routes/main");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use("/public", express.static("public"));

// typical user filter search
app.post("/submit", onSubmit);

// default main page
app.get("/",getMain);

// admin page 
app.get("/admin", getAdminPage);

// admin updating
app.get("/update", onUpdate);

app.listen(3010, () => {
    console.log("server is running");
})
