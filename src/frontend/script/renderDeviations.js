/* TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
- GESTIRE minWidth
- OTTENERE width in modo dinamico
*/
const minW = 20;

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
    .style("display", "block")
    .style("margin", "auto");

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
    .style("stroke-width", 2)
    .style("opacity", "0.5");
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
        .style("stroke-width", 2)
        .style("opacity", "0.5");;        
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
    .range([0, width-40]) //TODO: modificare

    var y = d3.scaleBand()
    .domain(data.map(d => d.error))
    .range([ height, 0 ])
    .padding([0.2]);

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range([colorDev.N,colorDev.A,colorDev.W,colorDev.R,colorDev.C]);

    var stackedData = d3.stack()
    .keys(subgroups)(data)

    var count=0;
    const dim = stackedData.reduce((acc, elem, i) => {
        const d = elem[0];
        const wCurr = x(d[1]) - x(d[0]) < minW && x(d[1]) - x(d[0])!=0 ? minW : x(d[1]) - x(d[0]);
        x(d[1]) - x(d[0]) < minW && x(d[1]) - x(d[0])!=0 && count++;
        var xCurr;

        if(wCurr>0 && i!=0){
            xCurr = acc[i-1].x+acc[i-1].w;
        } else {
            xCurr=0;
        }
        return [...acc, {err:d.data.error, k: elem.key, w: wCurr, x:xCurr, val:d[1]-d[0]}]
    }, []);

    const colorTop = error=="missing" ? colorDev.miss : error=="repetition" ? colorDev.rep : colorDev.mism;
    sumTotal>0 && svg.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width",x(sumTotal)+minW*count)
    .attr("height", height)
    .attr("style", "fill:"+colorTop)
    .style("stroke", "black")
    .style("stroke-width", 1);;
    sumTotal>0 && svg.append("text")
    .attr("y", height/2+5)
    .attr("x",width/2)
    .attr("font-family", "Helvetica")
    .text(sumTotal)

    svg.append("g")
    // .selectAll("g")
    // .data(dim).enter()
    // .append("g")
    // .attr("fill", function(d) {return color(d.k); })

    .selectAll("rect")
    .data(dim)
    .enter().append("rect")
        .attr("x", function(d) {
            // const w = x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            // if(d[1] == sumTotal) return x(d[0])
            // return x(d[1])-w;
            //console.log(x(d[0]));
            //return x(d[0]);
            return d.x;
        })
        .attr("width", function(d) {
            //return x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            //return x(d[1]) - x(d[0]);
            return d.w;
        })
        .attr("y", function(d) {/*return y(d.data.error)+height;*/ return y(d.err)+height; })
        .attr("height", y.bandwidth())
        .attr("fill", function(d) {return color(d.k); })
        .style("stroke", "black")
        .style("stroke-width", 1);

    svg.selectAll("text.activity")
    .data(dim)
    .enter()
    .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {/*return x(d[0][0]);*/return d.x+(d.w/2) })
        .attr("y",  function(d) {return y(d.err)*4+height})
        .attr("font-family", "Helvetica")
        .text(function(d) {/*return d[0][1]-d[0][0] == 0 ? "" : d[0][1]-d[0][0]*/return d.val == 0 ? "" : d.val})
}

function renderErrorsBars(objAlignment, selector){

    const sumTotal = objAlignment.totMissing+objAlignment.totRepetition+objAlignment.totMismatch;
    
    /* data = [{error:"missing", N:3,A:5, ...}] */
    const data = [{error: "tot", missing: objAlignment.totMissing, repetition:objAlignment.totRepetition, mismatch:objAlignment.totMismatch}]
    const subgroups = ["missing","repetition","mismatch"];
    const fullW = selector == "stateDeviations" ? 800 : 400;

    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = fullW - margin.left - margin.right,
    height = 60 - margin.top - margin.bottom;

    var svg = d3.select("#"+selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height*2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    sumTotal>0 && svg.append("text")
    .attr("y", height/2+margin.top)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
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

    var count=0;
    const dim = stackedData.reduce((acc, elem, i) => {
        const d = elem[0];
        const wCurr = x(d[1]) - x(d[0]) < minW && x(d[1]) - x(d[0])!=0 ? minW : x(d[1]) - x(d[0]);
        x(d[1]) - x(d[0]) < minW && x(d[1]) - x(d[0])!=0 && count++;
        var xCurr;

        if(wCurr>0 && i!=0){
            xCurr = acc[i-1].x+acc[i-1].w;
        } else {
            xCurr=0;
        }
        return [...acc, {err:d.data.error, k: elem.key, w: wCurr, x:xCurr, val:d[1]-d[0]}]
    }, []);

    svg.append("g")
    // .selectAll("g")
    // .data(stackedData)
    // .enter().append("g")
    // .attr("fill", function(d) {return color(d.key); })

    .selectAll("rect")
    .data(dim)
    .enter().append("rect")
        .attr("x", function(d) {
            // const w = x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            // if(d[1] == sumTotal) return x(d[0])
            // return x(d[1])-w;
            /*return x(d[0]);*/return d.x;
        })
        .attr("width", function(d) {
            //return x(d[1]) - x(d[0]) < 20 && x(d[1]) - x(d[0])!=0 ? 20 : x(d[1]) - x(d[0]);
            /*return x(d[1]) - x(d[0]);*/return d.w;
        })
        .attr("y", function(d) {/*return y(d.data.error)+height;*/ return y(d.err)+height; })
        .attr("height", y.bandwidth())
        .attr("fill", function(d) {return color(d.k); })
        .style("stroke", "black")
        .style("stroke-width", 1);;

    // svg.selectAll("text.error")
    // .data(stackedData)
    // .enter()
    // .append("text")
    //     .attr("text-anchor", "middle")
    //     .attr("x", function(d) {return x(d[0][0]); })
    //     .attr("y", y("tot")*4+height)
    //     .attr("font-family", "Helvetica")
    //     .text(function(d) {return d[0][1]-d[0][0] == 0 ? "" : d[0][1]-d[0][0]})

    svg.selectAll("text.error")
    .data(dim)
    .enter()
    .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {/*return x(d[0][0]);*/return d.x+(d.w/2) })
        .attr("y",  function(d) {return y(d.err)*4+height})
        .attr("font-family", "Helvetica")
        .text(function(d) {/*return d[0][1]-d[0][0] == 0 ? "" : d[0][1]-d[0][0]*/return d.val == 0 ? "" : d.val})
}

function renderState(alignments, selector, sorter) {
    for(var i=0;i<alignments.length;i++){
        renderErrorsBars(alignments[i],selector)
    }
}