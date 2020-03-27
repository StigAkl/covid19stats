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

app.post("/", (req, res) => {
    exec('sh '.concat(deployDirectory,deployFile),
	(error, stdout, stderr) => { 
           console.log(stdout); 
           console.log(stderr); 

           if(error !== null) {
		console.log(`exec error: ${error}`); 
	   }
	}
)

});

app.listen(3002, () => {
console.log(deployDirectory); 
console.log("Listening on 3002"); 
}); 

