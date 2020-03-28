const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser"); 
const dotenv = require("dotenv"); 
const { exec } = require("child_process"); 

// Configurations
dotenv.config()
const deployDirectory = process.env.APP_DIRECTORY;
const deployFile = process.env.DEPLOY_FILE;
const appPrivateKey = process.env.PRIVATE_KEY; 
const PORT = process.env.DEPLOY_SERVER_PORT; 
require("log-timestamp");

app.use(bodyParser.urlencoded( { extended: false }))

app.post("/".concat(appPrivateKey), (req, res) => {

    exec('.'.concat(deployDirectory,deployFile),
	(error, stdout, stderr) => {
           console.log(stdout); 
           console.log(stderr); 
           if(error !== null) {
		console.log(`exec error: ${error}`);
               res.status(500).send("Error: ", error); 
	   }

       res.status(200).send("Ok"); 
	}
) 
});

app.listen(PORT, () => {
console.log("Listening on 3002"); 
}); 

