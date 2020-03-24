const express = require("express"); 
const app = express(); 
const request = require("request"); 
const homeRoutes = require("./routes/home");
const dataUrl = "https://redutv-api.vg.no/corona/v1/sheets/norway-region-data";
const sqlite3 = require("sqlite3").verbose(); 
const morgan = require("morgan");

//Configurations
const dbString = process.env.DATABASE_STRING || "dev_db"; 
const port = process.env.PORT || 3001;
const db = new sqlite3.Database(dbString); 

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

async function createCountriesTableIfNotExist() {
    const create = "CREATE TABLE IF NOT EXISTS countries(name TEXT PRIMARY KEY, confirmed_cases INTEGER, total_population INTEGER, confirmed_deaths INTEGER, last_updated TEXT)";
    const insert = "INSERT INTO countries(name, confirmed_cases, total_population, confirmed_deaths, last_updated) VALUES('Norway', 2500, 5368000, 12, datetime('now'))";

    //db.run(create); 

    //db.run(insert);
}

async function fetchData() {
        request.get(dataUrl, (error, response, body) => {
            let json = JSON.parse(body); 
            const update = "UPDATE countries SET confirmed_cases=?,confirmed_deaths=?, last_updated=datetime('now') WHERE name='Norway'"
            db.run(update, [json.metadata.confirmed.total, json.metadata.dead.total]); 
        });
}

app.listen(port, async () => {

    await createCountriesTableIfNotExist().then( async () => {
        await fetchData();
        setInterval(()=> {
            console.info("fetching"); 
            fetchData();
        }, 1200000)
    })
    console.log("Listening on port 3001"); 
})
