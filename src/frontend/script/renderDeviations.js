/* TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
- GESTIRE minWidth
- OTTENERE width in modo dinamico
*/

const colorDev = { tot:"grey", miss: "#bebada", rep: "#fdb462", mism: "#8dd3c7",
    N:"#80b1d3", A:"#b3de69", W:"#fb8072",R:"#fccde5",C:"#ffffb3"};

/* AUXILIARY FUNCTIONS */

function sumErrorsDeviation(data, error){
    return data.reduce((accumulator, object) => {
        return {
            N: accumulator.N + object[error].N,
            A: accumulator.A + object[error].A,
            W: accumulator.W + (object[error].W || 0),
            R: accumulator.R + object[error].R,
            C: accumulator.C + object[error].C,
        }
    }, {N:0, A:0, W:0, R:0, C:0});
}


/* MAIN RENDER */

function renderDeviationsBlock(fullAlignments, alignments) {
    fullAlignments = fullAlignments.filter(inc => inc.totMissing+inc.totRepetition+inc.totMismatch>0);
    alignments = alignments.filter(inc => inc.totMissing+inc.totRepetition+inc.totMismatch>0);

    d3.select("#barMissing").selectAll("*").remove();
    d3.select("#barRepetition").selectAll("*").remove();
    d3.select("#barMismatch").selectAll("*").remove();

    d3.select("#divTopOne").selectAll("*").remove();
    d3.select("#divTopTwo").selectAll("*").remove();
    d3.select("#divTopThree").selectAll("*").remove();

    d3.select("#stateDeviations").selectAll("*").remove();

    // // Render legend
    // renderLegendError("legend");

    // Render bars for each error category    
    renderActivityBars(alignments, "missing", "barMissing");
    renderActivityBars(alignments, "repetition", "barRepetition");
    renderActivityBars(alignments, "mismatch","barMismatch");
    

    // Render bars for the top 3 wrong traces
    const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
    const sortedErrors = fullAlignments.sort(sorter);
    renderErrorsBars(sortedErrors[0], "divTopOne");
    renderErrorsBars(sortedErrors[1], "divTopTwo");
    renderErrorsBars(sortedErrors[2], "divTopThree");
    
    // Render checkboxes and state block
    const sortedFilteredErrors = alignments.sort(sorter);
    renderState(sortedFilteredErrors, "stateDeviations", sorter);
}


/* ERROR CATEGORY BLOCK */
function renderLegendError(selector){
    var len = 0;
    var offset = 100;
    const dBlock = 20;
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 550 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

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

    var legContainerError = svg.selectAll(selector+".itemE")
        .data(keysError)
        .enter().append('g')
        .attr("class", selector+".itemE")
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
    legContainerError.append("rect")
    .attr("class", "barErr")
    .attr("x", dBlock)
    .attr("y", dBlock)
    .attr("width", dBlock)
    .attr("height", dBlock)
    .style("fill", function(d){ return colorError(d)})
    .style("stroke", "black")
    .style("stroke-width", 2);
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
                return "translate(0,0)"
            } else { 
                var prevLen = len
                len +=  d.length + offset
                return "translate(" + (prevLen) + ",0)"
            }
        })
    legContainerActivity.append("rect")
        .attr("class", "barAct")
        .attr("x", dBlock)
        .attr("y", 3*dBlock)
        .attr("width", dBlock)
        .attr("height", dBlock)
        .style("fill", function(d){ return colorActivity(d)})
        .style("stroke", "black")
        .style("stroke-width", 2);        
    legContainerActivity.append("text")
        .attr("x", dBlock + dBlock*1.2)
        .attr("y", 3*dBlock + (dBlock/2))
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    // svg.selectAll(".barErr").on("click", function(d,i) {console.log(i);})
    // svg.selectAll(".barAct").on("click", function(d,i) {console.log(i);})

}

function renderActivityBars(alignments, error, selector){

    /* objDeviations = {N:3,A:5, ...}*/
    const objDeviations = sumErrorsDeviation(alignments, error);
    
    const sumTotal = Object.values(objDeviations).reduce((a, b) => a + b, 0);
    
    /* data = [{error:"missing", N:3,A:5, ...}] */
    const data = [{error:error, ...objDeviations}]
    //console.log(data)

    const subgroups = ["N","A","W","R","C"];

    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 400 - margin.left - margin.right,
    height = 60 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height*2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
    .domain([0, sumTotal])
    .range([0, width])

    var y = d3.scaleBand()
    .domain(data.map(d => d.error))
    .range([ height, 0 ])
    .padding([0.2]);

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range([colorDev.N,colorDev.A,colorDev.W,colorDev.R,colorDev.C]);


    const colorTop = error=="missing" ? colorDev.miss : error=="repetition" ? colorDev.rep : colorDev.mism;
    sumTotal>0 && svg.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width",width)
    .attr("height",height)
    .attr("style", "fill:"+colorTop);
    sumTotal>0 && svg.append("text")
    .attr("y", height/2)
    .attr("x",width/2)
    .text(sumTotal)

    var stackedData = d3.stack()
    .keys(subgroups)(data)

    svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function(d) {return color(d.key); })

    .selectAll("rect")
    .data(function(d) {return d; })
    .enter().append("rect")
        .attr("x", function(d) {
            // const w = x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            // if(d[1] == sumTotal) return x(d[0])
            // return x(d[1])-w;
            return x(d[0]);
        })
        .attr("width", function(d) {
            //return x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            return x(d[1]) - x(d[0]);
        })
        .attr("y", function(d) {return y(d.data.error)+height; })
        .attr("height", y.bandwidth());

    svg.selectAll("text.activity")
    .data(stackedData)
    .enter()
    .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {return x(d[0][0]); })
        .attr("y", y(error)*4+height)
        .text(function(d) {return d[0][1]-d[0][0] == 0 ? "" : d[0][1]-d[0][0]})
}

function renderErrorsBars(objAlignment, selector){

    const sumTotal = objAlignment.totMissing+objAlignment.totRepetition+objAlignment.totMismatch;
    
    /* data = [{error:"missing", N:3,A:5, ...}] */
    const data = [{error: "tot", missing: objAlignment.totMissing, repetition:objAlignment.totRepetition, mismatch:objAlignment.totMismatch}]

    const subgroups = ["missing","repetition","mismatch"];

    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 400 - margin.left - margin.right,
    height = 60 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height*2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    sumTotal>0 && svg.append("text")
    .attr("y", height/2)
    .attr("x",width/2)
    .text(objAlignment.incident_id)

    var x = d3.scaleLinear()
    .domain([0, sumTotal])
    .range([0, width])

    var y = d3.scaleBand()
    .domain(data.map(d => d.error))
    .range([ height, 0 ])
    .padding([0.2]);

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range([colorDev.miss,colorDev.rep,colorDev.mism]);

    var stackedData = d3.stack()
    .keys(subgroups)(data)

    svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function(d) {return color(d.key); })

    .selectAll("rect")
    .data(function(d) {return d; })
    .enter().append("rect")
        .attr("x", function(d) {
            // const w = x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            // if(d[1] == sumTotal) return x(d[0])
            // return x(d[1])-w;
            return x(d[0]);
        })
        .attr("width", function(d) {
            //return x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            return x(d[1]) - x(d[0]);
        })
        .attr("y", function(d) {return y(d.data.error)+height; })
        .attr("height", y.bandwidth());

    svg.selectAll("text.error")
    .data(stackedData)
    .enter()
    .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {return x(d[0][0]); })
        .attr("y", y("tot")*4+height)
        .text(function(d) {return d[0][1]-d[0][0] == 0 ? "" : d[0][1]-d[0][0]})
}

function renderState(alignments, selector, sorter) {
    for(var i=0;i<alignments.length;i++){
        renderErrorsBars(alignments[i],selector)
    }
}