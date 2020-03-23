const express = require("express"); 
const app = express(); 
const path = require("path")


app.set("view engine", "ejs"); 

app.get("/", (req, res, next) => {
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

app.listen(3000, () => {
    console.log("Listening on port 3000"); 
})