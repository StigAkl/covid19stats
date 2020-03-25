const AppDao = require("./database/dao"); 
const StatisticsRepository = require("./database/StatisticsRepository"); 

const StatisticsDAO = new StatisticsRepository(new AppDao("testdao.db")); 

async function func1() {
    for(let i = 0; i < 12314124234232421; i++) {
        2+2; 
    }

    console.log("Func1 finished"); 
}

async function func2() {
    for(let i = 0; i < 12421; i++) {
        2+2; 
    }

    console.log("Func2 finished"); 
}

var main = async() => {
    await func1(); 
    await func2(); 
}

main(); 