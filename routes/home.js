const express = require("express"); 
const router = express.Router(); 
const sqlite = require("sqlite3").verbose(); 
const dotenv = require("dotenv"); 
dotenv.config();  

const db = new sqlite.Database(process.env.DATABASE_STRING); 

router.get("/", async (req, res) => {

    let sql = `SELECT * FROM countries WHERE name='Norway'`;
    let time_series_sql_confirmed = `SELECT * FROM timeseries_total_confirmed WHERE country='Norway'`;
    let time_series_sql_dead = `SELECT * FROM timeseries_total_dead WHERE country='Norway'`;
    db.get(sql, [], (err, row) => {
        if(err) {
            res.status(500).send("Internal server error"); 
            throw err; 
        }
 
        const confirmed_cases = row.confirmed_cases; 
        const confirmed_deaths = row.confirmed_deaths; 

        db.all(time_series_sql_dead, (err, rows) => {
            if(err) {
                res.status(500).send("Internal server error"); 
                throw err; 
            }

            const timeseries_dead = rows; 

            db.all(time_series_sql_confirmed, (err, rows) => {
                if(err) {
                    res.status(500).send("Internal server error"); 
                    throw err; 
                }

                const timeseries_confirmed = rows; 
                console.log(timeseries_confirmed)
                res.render("index", {confirmed_cases: confirmed_cases, confirmed_deaths: confirmed_deaths, timeseries_confirmed: timeseries_confirmed, timeseries_dead: timeseries_dead});  
            })
        })
        
    })
});



module.exports = router; 
