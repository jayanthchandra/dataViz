var svg = d3.select('#chartDefense').append('svg').attr("width", 700).attr("height", 500);

async function init() {
    // Acquire data
    data = await d3.csv("data/goalkeeping.csv");
    let y_label = "Clean Sheet %";
    let x_label = "Goals Allowed";

    // setup dimensions
    var margin = 50;
    var width = 700;
    var height = 400;

    // add tooltips to show descriptions (source: https://www.d3-graph-gallery.com/graph/scatter_tooltip.html)
    var tooltip = d3.select("#chartDefense")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#e9ecef")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        let htmlToolTip = "<p><b><u>" + d.Squad + "</u></b></p>"
        + "<p><b>Goals Against: " + parseInt(d.GA) + "</b></p>"
        + "<p><b>Clean Sheet %: " + parseFloat(d.CSPercentage) + "</b></p>"
        + "<p><b>Shots on Target Against: " + parseInt(d.SoTA) + "</b></p>"
        + "<p><b>Wins, Draws, Losses: " + parseInt(d.W) + ", " + parseInt(d.D) + ", " + parseInt(d.L) + "</b></p>"
        tooltip
            .html(htmlToolTip)
            .style("left", (d3.mouse(this)[0] + 80) + "px")
            .style("top", (d3.mouse(this)[1] + 50) + "px")
    }

    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(100)
            .style("opacity", 0)
    }

    // setup x, and y scales
    var x_scale = d3.scaleLinear().domain([0, 24]).range([0, width]);
    var y_scale = d3.scaleLinear().domain([0, 70]).range([height, 0]);

    // add attributes to chart
    var chart = d3.select("svg")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g").attr("transform", "translate(" + margin + "," + margin + ")");
    chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_scale(parseInt(d.GA)); })
        .attr("cy", function (d) { return y_scale(parseFloat(d.CSPercentage)); })
        .attr("r", 10)
        .style('fill', 'red')
        .style("opacity", 0.3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // create x, y axis
    x_axis = d3.axisBottom(x_scale).tickFormat(d3.format("~s"));
    y_axis = d3.axisLeft(y_scale).tickFormat(d3.format("~s"));

    // add axes to chart
    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")")
        .call(y_axis);
    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
        .call(x_axis);

    // add labels to axes on chart
    d3.select("svg")
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 400)
        .attr("y", height + 2 * margin)
        .text(x_label);
    d3.select("svg")
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", margin - 35)
        .attr("x", -180)
        .text(y_label);

    // add annotations
    const annotations = [
        {
            note: {
                label: "Finalist 1: Real Madrid has one of the highest Shots on Target",
                bgPadding: 20,
                title: "Real Madrid"
            },
            className: "show-bg",
            dy: -90,
            dx: 100,
            y: y_scale(parseFloat(data.filter(d => d.Squad == "es Real Madrid")[0].CSPercentage)),
            x: x_scale(parseInt(data.filter(d => d.Squad == "es Real Madrid")[0].GA)),
        },{
            note: {
                label: "Finalist 2: Liverpool won against Bayern Munich",
                bgPadding: 20,
                title: "Liverpool"
            },
            className: "show-bg",
            dy: 20,
            dx: 150,
            y: y_scale(parseFloat(data.filter(d => d.Squad == "eng Liverpool")[0].CSPercentage)),
            x: x_scale(parseInt(data.filter(d => d.Squad == "eng Liverpool")[0].GA)), 

        }
    ]

    const makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutElbow)
        .annotations(annotations)

    chart
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)

}