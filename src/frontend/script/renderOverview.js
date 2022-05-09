const colorsDev = {N:"#80b1d3", A:"#b3de69", W:"#fb8072",R:"#fccde5",C:"#ffffb3"};
const dateRange = d3.timeDays(new Date(2016, 2, 19), new Date(2017, 2, 18));

function renderOverviewBlock(alignments, incidents){
    const dataGroupedStructure = alignments.reduce((acc, elem)=> {
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
    // const sumTotal =dataGroupedStructure.reduce((a, elem) => a+elem.count, 0);
    // console.log(sumTotal);
    
    renderSequences(dataGroupedStructure, "focus");

    // const countersClose = incidents.map(object => {
    //     return Date.parse(object.closeTs);
    // });
    // const maxDate = Math.min(...countersClose);

    renderLineLog(incidents, "context")
}

function renderSequences(data, selector){
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

function renderLineLog(data, selector){

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}