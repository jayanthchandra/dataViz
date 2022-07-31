var svg = d3.select('#chartPossession').append('svg').attr("width", 760).attr("height", 560);

async function init() {
    // Acquire data
    data = await d3.csv("data/possession.csv");
    // sort data
    data.sort(function (b, a) {
        return parseFloat(a.Poss) - parseFloat(b.Poss);
    });

    // Setup dimensions
    var margin = 80;
    var width = 1200;
    var height = 400;

    // add tooltips to show descriptions (source: https://www.d3-graph-gallery.com/graph/scatter_tooltip.html)
    var tooltip = d3.select("#chartPossession")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#e9ecef") // color of jumbotron
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
        + "<p><b>Possession (%): " + parseFloat(d.Poss) + "</b></p>"
            + "<p><b>Total Touches: " + parseInt(d.Touches) + "</b></p>"
            + "<p><b>Carries: " + parseInt(d.Carries) + "</b></p>"
            + "<p><b>Progressive Distance: " + parseFloat(d.PrgDist) + "</b></p>";
        tooltip
            .html(htmlToolTip)
            .style("left", width * .5 + "px")
            .style("top", "50px")
    }

    // var mouseout = function (d) {
    //     console.log("Mouse Leave")
    //     tooltip
    //         .transition()
    //         .duration(500)
    //         .style("opacity", 0)
    // }

    // setup x, and y scales
    var x_scale = d3.scaleBand()
        .domain(data.map(function (d) { return d.Squad; }))
        .range([0, width])
        .padding(0.5);
    var y_scale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // add attributes to the chart
    var chart = d3.select("svg")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g").attr("transform", "translate(" + margin + "," + margin + ")");
    chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x_scale(d.Squad); })
        .attr("y", function (d) { return y_scale(parseFloat(d.Poss)); })
        .attr("width", x_scale.bandwidth())
        .attr("height", function (d) { return height - y_scale(parseFloat(d.Poss)); })
        .style("fill", '#ccc31b')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        // .on("mouseout", mouseout);

    // create x, y axis
    x_axis = d3.axisBottom(x_scale);
    y_axis = d3.axisLeft(y_scale);

    // add axes to chart
    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")")
        .call(y_axis);
    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
        .call(x_axis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // add labels to axes on chart
    x_label = "Team";
    y_label = "Possession (%)";
    d3.select("svg")
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 600)
        .attr("y", height + 2 * margin)
        .text(x_label);
    d3.select("svg")
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -160)
        .text(y_label);

    // add annotations
    const annotations = [
        // {
        //     note: {
        //         label: "Team had the highest pass completion rate of 88.3%",
        //         bgPadding: 20,
        //         title: "Manchester City"
        //     },
        //     className: "show-bg",
        //     dy: -10,
        //     dx: 20,
        //     y: y_scale(parseFloat(data.filter(d => d.Squad == "Manchester City")[0].Poss)),
        //     x: x_scale(data.filter(d => d.Squad == "Manchester City")[0].Squad),
        // },
        {
            note: {
                label: "Real Madrid had 51% possession and higher progressive distance",
                bgPadding: 20,
                title: "Real Madrid"
            },
            className: "show-bg",
            dy: -10,
            dx: 20,
            y: y_scale(parseFloat(data.filter(d => d.Squad == "es Real Madrid")[0].Poss)),
            x: x_scale(data.filter(d => d.Squad == "es Real Madrid")[0].Squad),
        },
        {
            note: {
                label: "Team had the highest pass completion rate of 63%",
                bgPadding: 20,
                title: "Bayern Munich"
            },
            className: "show-bg",
            dy: -10,
            dx: 20,
            y: y_scale(parseFloat(data.filter(d => d.Squad == "de Bayern Munich")[0].Poss)),
            x: x_scale(data.filter(d => d.Squad == "de Bayern Munich")[0].Squad),
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