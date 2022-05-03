function renderParallelIncidents2(data, selector){
}

function renderParallelIncidents(data, selector) {
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 0, bottom: 10, left: 0},
    width = 450 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    dimensions = Object.keys(data[0]).filter(function(d) { return d != "incident_id" })

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scalePoint()
        .domain( data.map(function(p) {return p[name]; }).sort() )
        .range([height, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg.selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("opacity", 0.5)

    // Draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")
}

function renderBarCategory(data, selector){

    var maxVal = d3.max(data, d => d.value);

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 10, bottom: 40, left: 60},
    width = 400 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, maxVal])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.category; }).sort().reverse())
    .padding(.1);
    svg.append("g")
    .call(d3.axisLeft(y))

    //Bars
    svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.category); })
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2")
}

async function renderIncidents() {
    const incidents = await eel.incidentsToJson()();
    const formatIncidents = JSON.parse(incidents)

    console.log(formatIncidents)

    renderParallelIncidents(formatIncidents, "parallelIncidents");
    //renderParallelIncidents2(formatIncidents, "parallelIncidents");

    const countCategories = formatIncidents.reduce((accumulator, object) => {
        if(Object.keys(accumulator).includes(object.category)){
            accumulator[object.category] +=1;
        } else {
            accumulator[object.category] = 1;
        }
        return accumulator
    }, {});
    const countCategoriesArr = Object.keys(countCategories).map(elem => {
        return {category: elem, value: countCategories[elem]}
    });

    //console.log(countCategoriesArr)
    renderBarCategory(countCategoriesArr, "barIncidents")



    d3.select("body").append("span").text("LOADED-INCIDENTS");
}