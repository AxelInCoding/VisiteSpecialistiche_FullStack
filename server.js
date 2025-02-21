
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const fs = require('fs');
const configuration = JSON.parse(fs.readFileSync('configuration.json'));
configuration.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const configuration = JSON.parse(fs.readFileSync('configuration.json'));
configuration.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const database= require("./database.js");
const prenotazione=database(configuration);



app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.use("/", express.static(path.join(__dirname, "public/src")));
app.use("/moment/dist/moment.js", express.static(path.join(__dirname, "/node_modules/moment/dist/moment.js")));




app.post("/insert", async (req, res) => {
    const visits = req.body;
    await prenotazione.insert(visits);
    res.json({ result: "Ok" });   
});

app.get("/select", async (req, res) => {
  const visits = await prenotazione.select();
  console.log(visits)
  res.json({ visits: visits });
});


app.get("/types", async(req, res) => {
  const types = await prenotazione.selectTypes();
  res.json({ types: types });
});




const server = http.createServer(app);

server.listen(80, () => {
    console.log("- server running");
});