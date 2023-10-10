/* eslint-disable no-console */
import app from "./app";
import config from "./config/config";
//const fs = require("fs");
//const https = require("https");

const { PORT } = config;

//CERT QA

//  const options = {
  //  key: fs.readFileSync("/home/gbmadmin/cert/2022/private.key"),
  //  cert: fs.readFileSync("/home/gbmadmin/cert/2022/cert.crt"),
  //  requestCert: false,
  //  rejectUnauthorized: false,
  //};


// CERT PRD

//const options = {
  //key: fs.readFileSync("/home/tss/certs/smartandsimple/smartsimple.key"),
  //cert: fs.readFileSync("/home/tss/certs/smartandsimple/smartsimple.crt"),
  //requestCert: false,
  //rejectUnauthorized: false,
//};



app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Application Running on: ${PORT}`);
});

//https.createServer(options, app).listen(PORT, (err) => {
  //if (err) {
    //return console.log(err);
  //}
  //console.log(`Application Running on: ${PORT}`);
//});
