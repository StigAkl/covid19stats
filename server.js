const express = require("express"); 
const app = express(); 
const request = require("request"); 
const homeRoutes = require("./routes/home");
const sqlite3 = require("sqlite3").verbose(); 
const morgan = require("morgan");
const dotenv = require('dotenv');

//Configurations
dotenv.config(); 
const dbString = process.env.DATABASE_STRING;
const port = process.env.PORT || 5000;
const db = new sqlite3.Database(dbString); 
const apiUrl = process.env.API_URL;
 
app.set("view engine", "ejs");  

//Setup middleware
app.use(morgan("common"));

//Setup routes
app.use(homeRoutes); 

//ChartJS Test
app.get("/charts", (req, res, next) => {
    const labels1 = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels3 = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturydag", "Sunday"];
    const labels4 = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels5 = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturydag", "Sunday"];
    const labels6 = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels7 = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturydag", "Sunday"];
    const labels8 = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels9 = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturydag", "Sunday"];
    res.render("test", {labels: [labels1, labels2, labels3, labels4, labels5, labels6, labels7, labels8, labels9,
        ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturydag", "Sunday"],
        ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturydag", "Sunday"]
    ]})
})

async function fetchData() {
        request.get(apiUrl, (error, response, body) => {
            let json = JSON.parse(body);

            const confirmed = json.timeseries.total.confirmed;
            const dead = json.timeseries.total.dead; 

            const lastDate = Object.keys(confirmed)[Object.keys(confirmed).length-1];
            const yesterday = Object.keys(confirmed)[Object.keys(confirmed).length-2];
            const totalYesterday = confirmed[yesterday]; 
            const totalDeadYesterday = dead[yesterday]; 

            db.get("SELECT * FROM timeseries_total_confirmed WHERE date=?", [lastDate], (err, row) => {
                if(err) {
                    throw err; 
                }

                let sql = "INSERT INTO timeseries_total_confirmed(country, total, date) VALUES('Norway',?,?)"
                let sql_dead = "INSERT INTO timeseries_total_dead(country, total, date) VALUES('Norway',?,?)"

                let inputData = [json.metadata.confirmed.total, lastDate]; 
                let inputDataDead = [json.metadata.dead.total, lastDate]; 
                
                let newRow = true; 
                if(row) {
                    sql = "UPDATE timeseries_total_confirmed SET total=? WHERE date=?";
                    sql_dead = "UPDATE timeseries_total_dead SET total=? WHERE date=?";
                    newRow = false; 
                }

                db.run(sql, inputData, (err, rows) => {
                    if(err) {
                        throw err; 
                    }
                    console.log("inserted timeseries row to confirmed"); 
                    db.run(sql_dead, inputDataDead, (err, row) => {
                        if(err) {
                            throw err; 
                        }

                        console.log("inserted timeseries row to dead"); 
                    })


                    //Check that the data from yesterday is updated. Update if not. 
                    if(newRow) {
                        db.get("SELECT * FROM timeseries_total_confirmed WHERE date=?", [yesterday], (err, row) => {
                                if(totalYesterday > row.total) {
                                     db.run("UPDATE timeseries_total_confirmed SET total=? WHERE date=?", [totalYesterday, yesterday], (err, row) => {
                                         db.run("UPDATE timeseries_total_dead SET total=? WHERE date=?", [totalDeadYesterday, yesterday], (err, row) => {
                                             console.log("Updated database with time series for dead and confirmed"); 
                                         });
                                    });
                                }
                        })
                    }
                }); 
            })

            

            const update = "UPDATE countries SET confirmed_cases=?,confirmed_deaths=?, last_updated=datetime('now') WHERE name='Norway'"

            db.run(update, [json.metadata.confirmed.total, json.metadata.dead.total]); 
        });
}

app.listen(port, async () => {

        await fetchData();
        setInterval(()=> { 
            fetchData();
        }, 1200000);

    console.log("Listening on port " + port); 
})
