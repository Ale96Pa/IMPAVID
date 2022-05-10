// const colorsDev = {N:"#80b1d3", A:"#b3de69", W:"#fb8072",R:"#fccde5",C:"#ffffb3"};
const dateRange = d3.timeDays(new Date(2016, 1, 19), new Date(2017, 2, 19));

const formatTime = d3.timeFormat("%Y-%m-%d");

function renderOverviewBlock(alignments, fullAlignmentData, incidents, fullIncidentData){

    d3.select("#focus").selectAll("*").remove();
    d3.select("#context").selectAll("*").remove();

    renderSequences(alignments, "focus");
    
    
    const allDates = dateRange.map(elem => {return {date: formatTime(elem), value: 0}});

    // TODO: migliorare assolutamente
    var dataIncTime = incidents.reduce((accumulator, elem) => {
        var start = new Date(elem.openTs.replace(/(\d+[/])(\d+[/])/, '$2$1'));
        var end = new Date(elem.closeTs.replace(/(\d+[/])(\d+[/])/, '$2$1'));
        var numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

        for(var i=0; i<=numDays; i++){
            var impactedDay = formatTime(start.setDate(start.getDate() + i));
            var foundObj = accumulator.find(e => {return e.date == impactedDay});
            if(foundObj){
                accumulator = accumulator.filter(e => e.date != impactedDay);
                accumulator = [...accumulator, {date:foundObj.date, value:foundObj.value+1}];
            }
        }
        return accumulator;
    },allDates);

    dataIncTime = dataIncTime.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))

    renderLineLog(dataIncTime, "context", fullAlignmentData, fullIncidentData)
}

function renderSequences(alignments, selector){

    d3.select("#focus").selectAll("*").remove();

    var data = alignments.reduce((acc, elem)=> {
        var structures = acc.map(e => e.structure);
        if(structures.includes(elem.alignment)){
            const currentInc = acc.find(e => e.structure == elem.alignment);
            tmp = acc.filter(e => e.structure != elem.alignment);
            acc = [...tmp, {structure:elem.alignment, count:currentInc.count+1}]
        } else {
            acc = [...acc, {structure:elem.alignment, count:1}]
        }
        return acc;
    }, []);
    /*to check correctness of data management*/
    // const sumTotal =data.reduce((a, elem) => a+elem.count, 0);
    // console.log(sumTotal);


    var len = 0;
    var offset = 1;
    const dBlock = 15;

    var margin = {top: 0, right: 5, bottom: 0, left: 10},
    width = 450 - margin.left - margin.right,
    height = 80 - margin.top - margin.bottom;
    
    const colorActivity = d3.scaleOrdinal()
    .domain(Object.keys(colorsDev))
    .range([colorsDev.N,colorsDev.A,colorsDev.W,colorsDev.R,colorsDev.C]);

    /* to get maximum number of events ==> maximum length */
    // const counters = data.map(object => {
    //     return object.count;
    //   });
    // const maxVal = Math.max(...counters)*dBlock;

    data = data.sort((a,b) => b.count - a.count);

    data.map((elem,i) => {
        const eventList = elem.structure.split(";").filter(e => !e.includes("M")).map(el => el.split("]")[1]).slice(0, -1);

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
        //.attr("class", "barAct")
        .attr("x", function(d,i){return i*dBlock})
        .attr("y", 2*dBlock)
        .attr("width", dBlock)
        .attr("height", dBlock)
        .style("fill", function(d){ return colorActivity(d)})
        .style("stroke", "black")
        .style("stroke-width", 1); 

        svg.selectAll("text.count")
        .data(eventList)
        .enter()
        .append("text")
            .attr("text-anchor", "middle")
            .attr("x", width-margin.left-margin.right)
            .attr("y",height/2+margin.top+margin.bottom)
            .text(function(d,i) {return eventList.length-1 == i ? elem.count : ""})
    });
}

function renderLineLog(data, selector, fullAlignmentData, fullIncidentData){

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) {return d3.timeParse("%Y-%m-%d")(d.date); }))
        .range([ 0, width ]);
    x.ticks(d3.timeDay.every(1));
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .call(d3.brushX()
            .on("brush", brushDate)
            //.extent([[0, 0], [180, 163]])
        );

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) {return x(d3.timeParse("%Y-%m-%d")(d.date)) })
            .y(function(d) {return y(d.value) })
        )

    function brushDate({selection}) {
        daterange = selection.map(x.invert, x);
        selectedIncidents = filterData(daterange, fullIncidentData);
        selectedAlignments = filterAlignmentsByIncidents(fullAlignmentData, selectedIncidents);
        
        renderMetrics(selectedAlignments);

        renderSequences(selectedAlignments, "focus");

        renderDeviationsBlock(fullAlignmentData, selectedAlignments);
        renderFitnessBlock(fullAlignmentData, fullIncidentData, selectedAlignments)
        renderIncidentsBlock(fullAlignmentData, fullIncidentData, selectedIncidents);
    }
}