/**
 * Install-script för Moment 1
 * Av Christofer Hansson, 2025
 */

const sqlite3 = require("sqlite3").verbose();

//Skapa databas
const db = new sqlite3.Database("./db/moment1databas.db");

//Skapa tabell (id, kurskod, kursnamn, kursplan, kursprogression, postad)
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS courses;");

    db.run(`
        CREATE TABLE courses(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coursecode TEXT NOT NULL UNIQUE,
            coursename TEXT NOT NULL,
            courseplan TEXT NOT NULL,
            courseprog TEXT NOT NULL,
            posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    `);
});

db.close();