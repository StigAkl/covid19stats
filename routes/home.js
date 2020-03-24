const express = require("express"); 
const router = express.Router(); 
const sqlite = require("sqlite3").verbose(); 
const dbString = process.env.DATABASE_STRING || "dev_db"; 
const dotenv = require("dotenv"); 

dotenv.config(); 
const db = new sqlite.Database(process.env.DATABASE_STRING); 

router.get("/", async (req, res) => {

    await db.run('CREATE TABLE IF NOT EXISTS countries (name TEXT PRIMARY KEY, confirmed_cases INTEGER, total_population INTEGER, confirmed_deaths INTEGER)');

    let sql = `SELECT * FROM countries WHERE name='Norway'`;

    db.get(sql, [], (err, row) => {
        if(err) {
            res.status(500).send("Internal server error"); 
            throw err; 
        }
 
        const confirmed_cases = row.confirmed_cases; 
        const confirmed_deaths = row.confirmed_deaths; 

        res.render("index", {confirmed_cases: confirmed_cases, confirmed_deaths: confirmed_deaths}); 
        
    })
});



module.exports = router; 
