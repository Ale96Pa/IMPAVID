const colorSeverity = {none:"#1a9641",low:"#a6d96a",medium:"#ffffbf",high:"#fdae61",critical:"#d7191c"}

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

/*
{metric: "fitness", value: 0.5},...,{}
*/
function renderViolinChart(data, selector, metric){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 250 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
    // console.log(document.getElementById(selector).offsetWidth)
    // console.log(document.getElementById(selector).offsetHeight)

    // append the svg object to the body of the page
    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    // Build and Show the Y scale
    var y = d3.scaleLinear()
    .domain([0,1])          // Note that here the Y scale is set manually
    .range([height, 0])
    svg.append("g").call( d3.axisLeft(y) )

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain([metric])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    // Features of the histogram
    var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(10))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

    var sumstat = d3.rollup(data, d => {
        input = d.map(function(g) { return g.value;})    // Keep the variable called Sepal_Length
        bins = histogram(input)   // And compute the binning on it.
        return(bins)
    }, d=> d.metric)

    sumstat = Array.from(sumstat, ([name, value]) => ({ name, value }));

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0
    for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3.max(lengths)
    if (longuest > maxNum) { maxNum = longuest }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

    // Color scale for dots
    var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([3,9]) //TODOOOOOOOOOOOOOOOOOOOOOOOOOOOO

    // Add the shape to this svg!
    svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
        .attr("transform", function(d){return("translate(" + x(d.name) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","grey") //TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        .attr("d", d3.area()
            .x0( xNum(0) )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )

    // Add individual points with jitter
    var jitterWidth = 40 //TODOOOOOOOOOOOOOOO
    svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d){return(x(d.metric) + x.bandwidth()/2 - Math.random()*jitterWidth )})
        .attr("cy", function(d){return(y(d.value))})
        .attr("r", 5)
        .style("fill", function(d){ return(myColor(d.value))})
        .attr("stroke", "white")
    
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

    const sorterF = (a, b) => a.value < b.value ? 1 : -1;
    filterFitness = filterFitness.sort(sorterF).slice(0, 100);

    renderFitnessBar(filterFitness, "fitnessBar")

    // var costTodo = alignmentData.map(elem => {
    //     return {incident_id: elem.incident_id, value: elem.costTotal};
    // });
    // renderFitnessBar(costTodo, "costTodo")

    // filterCostsInPercentage = filterCostsInPercentage.filter(elem => {
    //     return 
    // });
    var keyFit = filterFitness.map(elem => elem.incident_id);
    //filterCostsInPercentage = filterCostsInPercentage.filter(elem => keyFit.includes(elem.incident_id))
    filterCostsInPercentage = filterCostsInPercentage.sort((a, b) => keyFit.indexOf(a.incident_id) - keyFit.indexOf(b.incident_id));

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
    //console.log(filterSeverity)

    //renderSeverityBar(filterSeverity, "severityBar")

    var filterViolinF = alignmentData.map(elem => {
        return {metric: "fitness", value: elem.fitness};
    });
    var filterViolinC = alignmentData.map(elem => {
        return {metric: "cost", value: elem.costTotal};
    });
    //console.log(filterViolinF);
    renderViolinChart(filterViolinF, "fitnessViolin", "fitness")
    renderViolinChart(filterViolinC, "costViolin", "cost")

    d3.select("body").append("span").text("LOADED-FITNESS");
}