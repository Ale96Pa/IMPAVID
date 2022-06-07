function renderMetrics(fullData){

    d3.select("#metrics").selectAll("*").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 300 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

    // Calculate number of incidents
    const numIncidents = filteredData.length;

    // Calculate average fitness
    const avgF = (filteredData.reduce((acc,e) => {return acc + parseFloat(e.fitness)},0)/numIncidents).toFixed(3);

    // Calculate average cost
    const avgC = (filteredData.reduce((acc,e) => {return acc + parseFloat(e.costTotal)},0)/numIncidents).toFixed(3);

    var svg = d3.select("#metrics")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("y", 10)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .attr("font-size", "20px")
    .text("Summary");

    svg.append("text")
    .attr("y", 40)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .attr("font-size", "20px")
    .text("N. incidents: ")
        .append("tspan")
        .attr("font-weight", "bold")
        .text(numIncidents+" ("+(numIncidents/fullData.length*100).toFixed(2)+"%)");

    svg.append("text")
    .attr("y", 70)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .attr("font-size", "20px")
    .text("Avg fitness: ")
        .append("tspan")
        .attr("font-weight", "bold")
        .text(avgF);

    svg.append("text")
    .attr("y", 100)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .attr("font-size", "20px")
    .text("Avg cost: ")
        .append("tspan")
        .attr("font-weight", "bold")
        .text(avgC);
}

function renderLegendError(selector){

    d3.select("#"+selector).selectAll("*").remove();

    var len = 0;
    var offset = 100;
    const dBlock = 20;
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 550 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    const keysError = ["Missing", "Repetition", "Mismatch"]
    const keysActivity = ["Detection", "Activation", "Awaiting", "Resolution", "Closure"]
    const colorError = d3.scaleOrdinal()
    .domain(keysError)
    .range([colorDev.miss, colorDev.rep, colorDev.mism]);
    const colorActivity = d3.scaleOrdinal()
    .domain(keysActivity)
    .range([colorDev.N,colorDev.A,colorDev.W,colorDev.R,colorDev.C]);

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("display", "block")
    .style("margin", "auto");

    svg.append("text")
    .attr("x", 20)
    .attr("y", 20)
    .attr("font-family", "Helvetica")
    .text("Errors");
    svg.append("text")
    .attr("x", 180)
    .attr("y", 20)
    .attr("font-family", "Helvetica")
    .text("Activities");

    var legContainerError = svg.selectAll(selector+".itemE")
        .data(keysError)
        .enter().append('g')
        .attr("class", selector+".itemE")
        .attr("transform", function (d, i) {
            if (i === 0) {
                len = d.length + offset 
                return "translate(0,20)"
            } else { 
                var prevLen = len
                len +=  d.length + offset
                // return "translate(" + (prevLen) + ",0)"
                var l = (40*i)+20;
                return "translate(0,"+ l +")";
            }
        });
    legContainerError.append("rect")
    .attr("class", "barErr")
    .attr("x", dBlock)
    .attr("y", dBlock)
    .attr("width", dBlock)
    .attr("height", dBlock)
    .style("fill", function(d){ return colorError(d)})
    .style("stroke", "grey")
    .style("stroke-width", 2)
    //.style("opacity", "0.5");
    legContainerError.append("text")
    .attr("x", dBlock + dBlock*1.2)
    .attr("y", dBlock+ (dBlock/2))
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

    var legContainerActivity = svg.selectAll(selector+".itemA")
        .data(keysActivity)
        .enter().append('g')
        .attr("transform", function (d, i) {
            if (i === 0) {
                len = d.length + offset 
                return "translate(150,-20)"
            } else {
                var l = -20+(30*i)
                return "translate(150,"+ l +")";
            }
        })
    legContainerActivity.append("rect")
        .attr("class", "barAct")
        .attr("x", dBlock)
        .attr("y", 3*dBlock)
        .attr("width", dBlock)
        .attr("height", dBlock)
        .style("fill", function(d){ return colorActivity(d)})
        .style("stroke", "grey")
        .style("stroke-width", 2)
        //.style("opacity", "0.5");
    legContainerActivity.append("text")
        .attr("x", dBlock + dBlock*1.2)
        .attr("y", 3*dBlock + (dBlock/2))
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
}

function renderDatasetAnalysis(fullData){

    d3.select("#detail").selectAll("*").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 1800 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    // Calculate number of incidents
    const totIncidents = fullData.length;
    const numIncidents = filteredData.length;

    var svg = d3.select("#detail")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height*2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const x = d3.scaleLinear()
    .domain([0, totIncidents])
    .range([0, width])

    svg.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width", x(totIncidents))
    .attr("height", height/2)
    .attr("style", "fill:none")
    .style("stroke", "black")
    .style("stroke-width", 2);

    svg.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width", x(numIncidents))
    .attr("height", height/2)
    .attr("style", "fill:"+colorRectCat.checked);

    svg.append("text")
    .attr("y", height/2-5)
    .attr("x",width/2)
    .attr("font-family", "Helvetica")
    .text((numIncidents/totIncidents*100).toFixed(2) + " %")
        // .append("tspan")
        .attr("font-weight", "bold");


    const data = filteredData.reduce((acc, elem)=> {
        var structures = acc.map(e => e.structure);
        if(structures.includes(elem.alignment)){
            const currentInc = acc.find(e => e.structure == elem.alignment);
            tmp = acc.filter(e => e.structure != elem.alignment);
            acc = [...tmp, {structure:elem.alignment, count:currentInc.count+1}]
        } else {
            acc = [...acc, {structure:elem.alignment, count:1}]
        }
        return acc;
    }, []).sort((a,b) => b.count - a.count);

    const xScaleVariants = d3.scaleLinear()
    .domain([0, numIncidents])
    .range([0, width])

    const colors = ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"];

    var sum = 0;
    data.map((elem,i) => {

        svg.append("rect")
        .attr("y", height)
        .attr("x", sum)
        .attr("width", xScaleVariants(elem.count))
        .attr("height", height/2)
        .attr("style", "fill:"+colors[i%colors.length])
        .style("stroke", "black")
        .style("stroke-width", 1);

        i<5 && svg.append("text")
        .attr("y", height+15)
        .attr("x", sum)
        .attr("font-family", "Helvetica")
        .text(elem.count)
            // .append("tspan")
            .attr("font-weight", "bold");

        sum += xScaleVariants(elem.count);
    })

}