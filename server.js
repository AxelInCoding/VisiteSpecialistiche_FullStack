const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const fs = require('fs');
const configuration = JSON.parse(fs.readFileSync('configuration.json'));
configuration.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const database= require("./database.js");
const prenotazione=database(configuration, (JSON.parse(fs.readFileSync("config.json"))).tipologie);



app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.use("/", express.static(path.join(__dirname, "public/src")));
app.use("/moment/dist/moment.js", express.static(path.join(__dirname, "/node_modules/moment/dist/moment.js")));




app.post("/add", async (req, res) => {
    const data = req.body;
    await prenotazione.insert(data);
    res.json({ result: "Ok" });   
});


app.get("/get", async (req, res) => {
    const dict = await prenotazione.selectAll();
    res.json({ result: dict });
});


app.get("/config", async (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json'));
    res.json(config);
});

const server = http.createServer(app);

server.listen(80, () => {
    console.log("- server running");
});



