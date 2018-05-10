var app = require("express")();
var http = require("http").Server(app);
// var io = require("socket.io")(http);
var path = require("path");
let csvToJson = require('convert-csv-to-json');
var fs = require("fs");

var port = process.env.PORT || 8080;

var json = csvToJson.fieldDelimiter(' ').getJsonFromCsv(path.join(__dirname + "/predictionThirdStep.csv"));

fs.writeFile(
    path.join(__dirname + "/predictionThirdStep.json"),
    JSON.stringify(json),
    err => {
        if (err) throw err;
        console.log("Saved!\n");
    }
);

http.listen(port, function () {
    console.log("Listening on port: " + port);
});


// fs.readFile(jsonPath, "utf8", (err, data) => {
//     if (err) console.log(err);
//     else {
//         var graph = JSON.parse(data);
//         var cnt = 0;

//         function stopFunction(x) {
//             clearInterval(x);
//         }

//         io.on("connection", function (socket) {
//             var speed = 1000;
//             var interval = setInterval(function () {
//                 var links = [];
//                 if (cnt < newNodes.nodes.length) {
//                     graph.nodes.push(newNodes.nodes[cnt]);
//                     newNodes.links.forEach(link => {
//                         if (link.source === newNodes.nodes[cnt].id) graph.links.push(link);
//                         links.push(link);
//                     });
//                     cnt++;
//                     socket.emit("update", {
//                         newNode: newNodes.nodes[cnt],
//                         links: links
//                     });
//                 } else {
//                     fs.writeFile(
//                         path.join(__dirname + "/updatedGraph.json"),
//                         JSON.stringify(graph),
//                         err => {
//                             if (err) throw err;
//                             console.log("Saved!\n");
//                         }
//                     );
//                     stopFunction(interval);
//                 }
//             }, speed);
//         });
//     }
// });