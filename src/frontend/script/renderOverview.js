/*
TODO: aggiustare width dinamica delle sequenze
*/

function renderOverviewBlock(fullAlignmentData, fullIncidentData){

    d3.select("#focus").selectAll("*").remove();
    d3.select("#context").selectAll("*").remove();

    renderSequences("focus");
    
    const allDates = fullDateRange.map(elem => {return {date: new Date(elem), value: 0}});
    var dataIncTime = filteredIncidentsData.reduce((accumulator, elem) => {
        const start = buildDate(elem.openTs);
        const end = buildDate(elem.closeTs);
        const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

        for(var i=0; i<=numDays; i++){
            const nextDay = new Date(start);
            nextDay.setDate(nextDay.getDate()+i);
            const foundDay = accumulator.find(e => {return e.date.toDateString() == nextDay.toDateString()});
            if(foundDay){
                const indexReplace = accumulator.indexOf(foundDay);
                accumulator[indexReplace] = {date:foundDay.date, value:foundDay.value+1}
            }
        }
        return accumulator;
    }, allDates);

    dataIncTime = dataIncTime.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))

    renderLineLog(dataIncTime, "context", fullAlignmentData, fullIncidentData)
}

function renderSequences(selector){

    d3.select("#focus").selectAll("*").remove();

    var len = 0;
    const offset = 1;
    const dBlock = 20;

    var margin = {top: 0, right: 5, bottom: 0, left: 10},
    width = 450 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

    const data = filteredAlignmentsData.reduce((acc, elem)=> {
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
    /*to check correctness of data management*/
    // const sumTotal =data.reduce((a, elem) => a+elem.count, 0);
    // console.log(sumTotal);

    const colorActivity = d3.scaleOrdinal()
    .domain(["N","A","W","R","C"])
    .range([colorDev.N,colorDev.A,colorDev.W,colorDev.R,colorDev.C]);

    /* to get maximum number of events ==> maximum length */
    // const counters = data.map(object => {
    //     console.log(object);
    //     return object.count;
    //   });
    // const maxVal = Math.max(...counters)*dBlock;

    //data = data.sort((a,b) => b.count - a.count);

    // TODO: vedi se aggiustare width
    data.map((elem,i) => {
        const eventList = elem.structure.split(";").filter(e => !e.includes("M")).map(el => el.split("]")[1]).slice(0, -1);
        //width = eventList.length*dBlock+ margin.left + margin.right + 2*dBlock;

        var svg = d3.select("#"+selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

        var container = svg.selectAll(selector+".item"+i)
        .data(eventList)
        .enter().append('g')
        .attr("transform", function (d, i) {
            if (i === 0) {
                len = d.length + offset 
                return "translate(0,0)"
            } else { 
                var prevLen = len
                len +=  d.length + offset
                return "translate(" + (prevLen) + ",0)"
            }
        });

        container.append("rect")
        .attr("x", function(d,i){return i*dBlock})
        .attr("y", dBlock)
        .attr("width", dBlock)
        .attr("height", dBlock)
        .style("fill", function(d){return colorActivity(d)})
        .style("stroke", "black")
        .style("stroke-width", 1); 
        container.append("text")
        .attr("y", dBlock+(dBlock/2)+(dBlock/4))
        .attr("x", function(d,i){return (i*dBlock)+2})
        .text(function(d){return d});

        svg.selectAll("text.count")
        .data(eventList)
        .enter()
        .append("text")
            .attr("text-anchor", "middle")
            .attr("x", width-margin.left-margin.right) 
            .attr("y",dBlock+(dBlock/2)+(dBlock/4))
            .attr("font-family", "Helvetica")
            .text(function(d,i) {return eventList.length-1 == i ? elem.count : ""})
    });
}

function renderLineLog(data, selector, fullAlignmentData, fullIncidentData){

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1900 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) {return d.date; }))
        .range([ 0, width ]);

    var brushO = d3.brushX()
    .on("end", brushDate)
    .extent([[0, 0], [width, width]]);

    const initialBrush = [x(dateRange[0]), x(dateRange[1])];
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeWeek.every(2))
            .tickFormat(d3.timeFormat('%-m/%-d/%y'))
        )
        .call(brushO)
        .call(d3.brushX().move, initialBrush);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y))
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Active incidents");;

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) {return x(d.date) })
            .y(function(d) {return y(d.value) })
        )

    function brushDate({selection}) {
        dateRange = selection.map(x.invert, x);
        combineFilters(fullAlignmentData, fullIncidentData);
        
        renderMetrics();
        renderSequences("focus");

        renderDeviationsBlock(fullAlignmentData);
        renderFitnessBlock(fullAlignmentData, fullIncidentData)
        renderIncidentsBlock(fullAlignmentData, fullIncidentData);

        renderPattern();
        renderDatasetAnalysis(fullAlignmentData);
    }
}

function buildDate(str){
    var parts = str.split("/");
    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
}