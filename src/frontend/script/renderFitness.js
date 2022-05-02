function renderFitnessBar(data, selector){
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d => d.incident_id))
    .padding(0.2);

    var xAxis = d3.axisBottom(x)
    .tickValues(x.domain().filter(function(d,i){ return !(i%10)}));

    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.incident_id))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", "#69b3a2");
}

function renderCostBar(data,selector){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#"+selector)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = ["missing", "repetition", "mismatch"];

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, d => d.incident_id)

    // Add X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.incident_id))
        .padding(0.2);
    var xAxis = d3.axisBottom(x)
        .tickValues(x.domain().filter(function(d,i){ return !(i%10)}));
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) {
                return x(d.data.incident_id); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
}

function renderSeverityBar(data,selector){

    var maxVal = d3.max(data, d => d.value);

    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d => d.severity))
    .padding(0.2);
    var xAxis = d3.axisBottom(x);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, maxVal])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.severity))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", "#69b3a2");
}

async function fooTODO() {
    const alignments = await eel.alignmentsToJson()();
    const alignmentData = Object.entries(JSON.parse(alignments)).map(entry => {
        return {incident_id: entry[0],
            ...entry[1]
        };
    });

    var filterFitness = alignmentData.map(elem => {
        return {incident_id: elem.incident_id, value: elem.fitness};
    });
    var filterCostsInPercentage = alignmentData.map(elem => {
        const tot = elem.costMissing+elem.costMismatch+elem.costRepetition;
        const percMiss = elem.costMissing*100/tot;
        const percRep = elem.costRepetition*100/tot;
        const percMism = elem.costMismatch*100/tot;

        return {incident_id: elem.incident_id, 
            costTot: elem.costTotal, 
            missing: percMiss*elem.costTotal/100, 
            repetition: percRep*elem.costTotal/100, 
            mismatch: percMism*elem.costTotal/100
        };
    });

    renderFitnessBar(filterFitness, "fitnessBar")

    // var costTodo = alignmentData.map(elem => {
    //     return {incident_id: elem.incident_id, value: elem.costTotal};
    // });
    // renderFitnessBar(costTodo, "costTodo")

    renderCostBar(filterCostsInPercentage, "costBar")

    const filterSeverity = alignmentData.reduce((accumulator, object) => {
        switch(object.severity){
            case "none":
                accumulator[0].value++
                break;
            case "low":
                accumulator[1].value++
                break;
            case "medium":
                accumulator[2].value++
                break;
            case "high":
                accumulator[3].value++
                break;
            case "critical":
                accumulator[4].value++
                break;
            default:
                break;
        }
        return accumulator;
    }, [{severity:"none", value:0}, {severity:"low", value:0}, {severity:"medium", value:0}, {severity:"high", value:0}, {severity:"critical", value:0}]);
    console.log(filterSeverity)

    renderSeverityBar(filterSeverity, "severityBar")

    d3.select("body").append("span").text("LOADED-FITNESS");
}