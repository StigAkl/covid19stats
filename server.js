require('log-timestamp'); 
const express = require("express"); 
const app = express(); 
const request = require("request"); 
const homeRoutes = require("./routes/home");
const AppDao = require("./database/dao"); 
const StatisticsRepository = require("./database/StatisticsRepository");  
const morgan = require("morgan");
const dotenv = require('dotenv');

//Configurations
dotenv.config(); 
const dbString = process.env.DATABASE_STRING;
const port = process.env.PORT || 5000;
const apiUrl = process.env.API_URL;
const StatisticsDAO = new StatisticsRepository(new AppDao(dbString)); 
app.set("view engine", "ejs");  

//Setup middleware
app.use(morgan("common"));

//Setup routes
app.use(homeRoutes); 

async function fetchData() {
        request.get(apiUrl, async (error, response, body) => {
            let json = JSON.parse(body);

            const confirmed = json.timeseries.total.confirmed;
            const dead = json.timeseries.total.dead; 

            const lastDate = Object.keys(confirmed)[Object.keys(confirmed).length-1];
            const yesterday = Object.keys(confirmed)[Object.keys(confirmed).length-2];
            const totalConfirmedYesterday = confirmed[yesterday]; 
            const totalDeadYesterday = dead[yesterday]; 


            try {
            await StatisticsDAO.UpdateCountryStatistics("Norway", json.metadata.confirmed.total, json.metadata.dead.total); 
            const confirmedTimeSeriesLastDate = await StatisticsDAO.GetConfirmedTimeSeriesByDate(lastDate); 

                let inputDataConfirmed = [json.metadata.confirmed.total, lastDate]; 
                let inputDataDead = [json.metadata.dead.total, lastDate]; 

                if(confirmedTimeSeriesLastDate) {
                    await StatisticsDAO.UpdateDeathsTimeSeries(inputDataDead[0], inputDataDead[1]);
                    await StatisticsDAO.UpdateConfirmedTimeSeries(inputDataConfirmed[0], inputDataConfirmed[1]);

                    const ConfirmedTimeSeriesYesterday = await StatisticsDAO.GetConfirmedTimeSeriesByDate(yesterday); 

                    if(totalConfirmedYesterday > ConfirmedTimeSeriesYesterday.total) {
                        await StatisticsDAO.UpdateConfirmedTimeSeries(totalConfirmedYesterday, yesterday); 
                        await StatisticsDAO.UpdateDeathsTimeSeries(totalDeadYesterday, yesterday); 
                        console.log("Updated database with time series for dead and confirmed yesterday"); 
                    }

                } else {
                    const date = inputDataDead[1].split("-"); 
                    if(date.length >= 3 && parseInt(date[2]) == new Date().getDate()) {
                        await StatisticsDAO.InsertDeathsTimeSeriesEntry("Norway", inputDataDead[0], inputDataDead[1])
                        await StatisticsDAO.InsertConfirmedTimeSeriesEntry("Norway", inputDataConfirmed[0], inputDataConfirmed[1])
                    }
                }

                console.log("Data fetched and updated"); 

            } catch(err) {
               console.error("Error fetching data from api", err); 
            }
        });
}

app.listen(port, async () => {

        await fetchData();
        setInterval(()=> { 
            fetchData();
        }, 1000*20*60);

    console.log("Listening on port " + port); 
})
