/*
Moment 1 - DT2007G Backend-baserad webbutveckling
Av Christofer Hansson, 2025 
*/

const express = require ("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

//Anslut till databasen
const db = new sqlite3.Database("./db/moment1databas.db");

//Inställningar
const app = express();
const port = 3000;


//View engine (views)
app.set("view engine", "ejs");
//Statiska filer (public)
app.use(express.static("public"));
//Möjlighet att läsa in formulärdata
app.use(bodyParser.urlencoded({ extended: true}));



//Routing

//Startsidan
app.get("/", (req, res) => {
    //Läs ut befintliga kurser på startsidan
    db.all("SELECT * FROM courses;", (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        res.render("index", {
            error: "",
            rows: rows
        });
    });
});


//Ta bort kurs
app.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    //Radera kurs från listan på startsidan (med SQL skyddad mot SQL injections-risk)
    db.run("DELETE FROM courses WHERE id=?;", id, (err) => {
        if (err) {
            console. error(err.message);
        }

        //Redirect till startsida
        res.redirect("/");
    });
});


//Om-sidan
app.get("/about", (req, res) => {
    res.render("about");
});


//Lägg till ny kurs-sidan (deklarera de variabler jag behöver använda men sätter dem som tomma)
app.get("/addcourse", (req, res) => {
    res.render("addcourse", { 
        errors: [],
        coursecode: "",
        coursename: "",
        courseplan: "",
        courseprog: ""
    });
});



//Skapa ny kurs
app.post("/addcourse", (req, res) => {
    let coursecode = req.body.kurskod;
    let coursename = req.body.kursnamn;
    let courseplan = req.body.kursplan;
    let courseprog = req.body.kursprogression;
    let errors = [];
    
    //Pusha in olika felmeddelanden till errors-arrayen beroende på vad som är fel i formuläret
    if (coursecode === "") {
        errors.push("Ange en korrekt kurskod");
    }

    if (coursename === "") {
        errors.push("Ange ett korrekt kursnamn");
    }

    if (courseplan === "") {
        errors.push("Ange en korrekt länk till kursplan");
    }

    if (courseprog === "") {
        errors.push("Ange en korrekt kursprogression"); 
    }

    //Om inget är fel, skicka formuläret och lagra svaren i databasen
    if (errors.length === 0) {

        //Lagra i databas med SQL (skyddad mot SQL injections-risk)
        const statement = db.prepare("INSERT INTO courses (coursecode, coursename, courseplan, courseprog) VALUES (?, ?, ?, ?);");
        statement.run(coursecode, coursename, courseplan, courseprog);
        statement.finalize();
    
        //Redirecta till startsidan
        res.redirect("/");

    //Om något är fel, ladda om sidan och visa aktuella felmeddelanden samt låt de korrekta fälten förbli ifyllda
    } else {
        res.render("addcourse", {
            errors,
            coursecode,
            coursename,
            courseplan,
            courseprog
        });
    }

});



//Starta servern
app.listen(port, () => {
    console.log("Server started on port: " + port);
});