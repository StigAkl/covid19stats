

function initialize_timeseries(db) {
    request.get("https://redutv-api.vg.no/corona/v1/sheets/norway-region-data", (error, response, body) => {
        
        let json = JSON.parse(body);
        let confirmed = json.timeseries.total.confirmed;
        let dead = json.timeseries.total.dead;   

        //const stmt = db.prepare("INSERT INTO timeseries_total_confirmed VALUES(?,?,?)");

        for(let key in confirmed) {
            if(confirmed.hasOwnProperty(key)) {
                //stmt.run("Norway", confirmed[key], key);
            }
        }

        // stmt.finalize(); 

        const stmt_dead = db.prepare("INSERT INTO timeseries_total_dead VALUES(?,?,?)");

        for(let key in dead) {
            if(dead.hasOwnProperty(key)) {
                stmt_dead.run("Norway", dead[key], key); 
            }
        }

        stmt_dead.finalize(); 

    })
}