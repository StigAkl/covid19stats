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
console.log("God you"); 

    exec('sh ./deploy/work.sh',
	(error, stdout, stderr) => {
	console.log("working..");  
           console.log(stdout); 
           console.log(stderr); 
           console.log("Still working.."); 
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

