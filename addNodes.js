var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");

var port = process.env.PORT || 8081;

var graphPath = path.join(__dirname + "/graph.json");

var newNodes = JSON.parse(
  fs.readFileSync(
    path.join(__dirname + "/newNodes.json"),
    "utf8",
    (err, data) => {
      if (err) console.log(err);
      return newNodes;
    }
  )
);

fs.readFile(graphPath, "utf8", (err, data) => {
  if (err) console.log(err);
  else {
    var graph = JSON.parse(data);
    var cnt = 0;

    function stopFunction() {
      clearInterval(x);
    }

    var x = setInterval(function() {
      if (cnt < newNodes.nodes.length) {
        graph.nodes.push(newNodes.nodes[cnt]);
        newNodes.links.forEach(link => {
          if (link.source === newNodes.nodes[cnt].id) graph.links.push(link);
        });
        cnt++;
      } else {
        fs.writeFileSync(
          path.join(__dirname + "/updatedGraph.json"),
          JSON.stringify(graph)
        );
        stopFunction();
      }
    }, 1000);
  }
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
