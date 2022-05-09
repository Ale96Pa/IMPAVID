function renderParallelIncidents(data, selector) {
    var margin = {top: 30, right: 0, bottom: 10, left: 10},
    width = 400 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    dimensions = Object.keys(data[0]).filter(function(d) { return d != "incident_id" })

    var y = {}
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scalePoint()
        .domain( data.map(function(p) {return p[name]; }).sort() )
        .range([height, 0])
    }

    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    svg.selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "#3182bd")
        .style("opacity", 1)

    svg.selectAll("myAxis")
        .data(dimensions).enter()
        .append("g")
        .attr("transform", function(d) {return "translate(" + x(d) + ")"; })
        .each(function(d) {d == "category" ? d3.select(this).call(d3.axisRight().scale(y[d])) : d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) {return d; })
        .style("fill", "black")
}

function renderBarCategory(data, selector){
    const maxVal = d3.max(data, d => d.value);

    var margin = {top: 20, right: 0, bottom: 30, left: 0},
    width = 350 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
    .domain([0, maxVal])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        //.attr("transform", "translate(-10,0)")
        .style("text-anchor", "end");

    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.category; }).sort().reverse())
    .padding(.1);
    svg.append("g")
    .call(d3.axisLeft(y))

    svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "barCat")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.category); })
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#3182bd")
    .style("opacity", 0.5);
}

async function renderIncidentsBlock(incidentData) {
    renderParallelIncidents(incidentData, "parallelIncidents");

    const countCategories = incidentData.reduce((accumulator, object) => {
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
    renderBarCategory(countCategoriesArr, "barIncidents");
}