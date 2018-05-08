$(document).ready(function () {
        var zeroLevelNodes = [],
            firstLevelLinks = [];

        var width = window.innerWidth,
            height = window.innerHeight;

        var svg = d3.select('body').append("svg").attr("id", "svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("prediction.json", function (err, graph) {

            graph.forEach(node => {
                zeroLevelNodes.push({
                    "node": parseInt(node.source),
                    "level": parseInt(node.step)
                })
                if (node.target != -1) {
                    firstLevelLinks.push({
                        "source": parseInt(node.source),
                        "target": parseInt(node.target)
                    })
                }
            })

            var node = svg.selectAll(".node")
                .data(zeroLevelNodes)
                .enter().append("circle")
                .attr("class", function (d) {
                    return "node " + d.node;
                })
                .attr("r", 2)
                .attr("fill", levelColor)
                .attr("id", function (d) {
                    return d.node;
                })

            var link = svg.selectAll(".link")
                .data(firstLevelLinks)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke", "#ccc")

            function tick() {
                node.attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

            }

            function levelColor(d) {
                return d.level == 0 ? "red" : "blue"
            }

            var drag_handler = d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);

            drag_handler(node)

            function drag_start(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function drag_drag(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function drag_end(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = d.x;
                d.fy = d.y;
            }

            function randomCol() {
                var colors = [
                    "purple",
                    "blue",
                    "red"
                ]
                var rand = Math.random()
                if (rand <= 0.33) return colors[0]
                else if (rand > 0.33 && rand <= 0.66) return colors[1]
                else return colors[2]
            }


            d3.interval(function () {
                zeroLevelNodes.push({
                    node: 123456,
                    step: randomCol()
                });
                firstLevelLinks.push({
                    source: 123456,
                    target: 164152
                })
                firstLevelLinks.push({
                    source: {
                        node: 123456
                    },
                    target: {
                        node: 512271
                    }
                })
                restart();
            }, 500, d3.now() + 500);


            function restart() {

                node = node.data(zeroLevelNodes, function (d) {
                    return d.node;
                });
                node.exit().remove();
                node = node.enter().append("circle")
                    .attr("fill", randomCol)
                    .attr("r", 2)
                    .merge(node)

                link = link.data(firstLevelLinks)
                link.exit().remove()
                link = link.enter().append("line")
                    .attr("class", "link")
                    .style("stroke", "#ccc")
                    .merge(link)

                simulation.nodes(zeroLevelNodes)
                simulation.force("link", d3.forceLink(firstLevelLinks).id(function (d) {
                        return d.node;
                    }).distance(100))
                    .restart()
            }



            var simulation = d3.forceSimulation(zeroLevelNodes)
                .force('charge', d3.forceManyBody().strength(-100))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('link', d3.forceLink(firstLevelLinks).id(function (d) {
                    return d.node;
                }))
                .force("x", d3.forceX())
                .force("y", d3.forceY())
                .alphaTarget(1)
                .on("tick", tick)

            restart();

        });
    })
