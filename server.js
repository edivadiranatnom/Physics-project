var d3 = require("d3");
var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");

var port = process.env.PORT || 8080;

app.get("/json", (req, res) => {
  var json = JSON.stringify(fs.readFileSync("graph.json", "utf8"));
  res.send(json);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
