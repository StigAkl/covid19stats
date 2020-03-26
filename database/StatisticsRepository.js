
class StatisticsRepository {
    constructor(dao) {
        this.dao = dao; 
    }

    /**
     * Create Countries Table
     */
    async CreateCountriesTable() {
        const SQL = "CREATE TABLE IF NOT EXISTS countries (name TEXT PRIMARY KEY, confirmed_cases INTEGER, total_population INTEGER, confirmed_deaths INTEGER, last_update TEXT)"; 
        return await this.dao.run(SQL); 
    }

    async GetStatsByCountry(name) {
        const SQL = "SELECT * FROM countries WHERE name = ?"; 
        return await this.dao.get(SQL, [name]); 
    }

    async GetConfirmedTimeSeriesByDate(date) {
        const SQL = "SELECT * FROM timeseries_total_confirmed WHERE date=?";
        return await this.dao.get(SQL, [date]); 
    }

    async GetDeathsTimeSeriesByDate(date) {
        const SQL = "SELECT * FROM timeseries_total_dead WHERE date=?";
        return await this.dao.get(SQL, [date]); 
    }

    async GetAllTimeSeriesConfirmed(country) {
        const SQL = "SELECT * FROM timeseries_total_confirmed WHERE country=?"; 
        return await this.dao.all(SQL, [country]); 
    }

    async GetAllTimeSeriesDeaths(country) {
        const SQL = "SELECT * FROM timeseries_total_dead WHERE country=?"; 
        return await this.dao.all(SQL, [country]); 
    }

    /**
     * 
     * @param {Name of the country for the time series entry} country 
     * @param {*Total confirmed} total 
     * @param {*Day on format MM-DD} date 
     */
    async InsertConfirmedTimeSeriesEntry(country, total, date) {
        const SQL = "INSERT INTO timeseries_total_confirmed(country, total, date) VALUES(?,?,?)"
        return await this.dao.run(SQL, [country, total, date]); 
    }

    async InsertDeathsTimeSeriesEntry(country, total, date) {
        const SQL = "INSERT INTO timeseries_total_dead(country, total, date) VALUES(?,?,?)"; 
        return await this.dao.run(SQL, [country, total, date]); 
    }

    async InsertCountry(name, confirmed_cases, total_population, confirmed_deaths) {
        return await this.dao.run(
            "INSERT INTO countries(name, confirmed_cases, total_population, confirmed_deaths, last_update) VALUES(?,?,?,?, datetime('now'))",
            [name, confirmed_cases, total_population, confirmed_deaths]
         );
    }

    /**
     * UPDATE STATISTICS
     */
     async UpdateCountryStatistics(country, confirmed_cases, confirmed_deaths) {
         const SQL =  "UPDATE countries SET confirmed_cases=?,confirmed_deaths=?, last_updated=datetime('now') WHERE name=?"
         return await this.dao.run(SQL, [confirmed_cases, confirmed_deaths, country]); 
     }

     async UpdateConfirmedTimeSeries(total, date) {
         const SQL = "UPDATE timeseries_total_confirmed SET total=? WHERE date=?";
         return await this.dao.run(SQL, [total, date]); 
     }

     async UpdateDeathsTimeSeries(total, date) {
         const SQL = "UPDATE timeseries_total_dead SET total=? WHERE date=?";
         return await this.dao.run(SQL, [total, date]); 
     }
}

module.exports = StatisticsRepository; 
