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

async function rendereDeviationsBlock() {
    var alignments = await eel.alignmentsToJson()();
    alignments = Object.entries(JSON.parse(alignments)).map(entry => {
        return {incident_id: entry[0],
            ...entry[1]
        };
    }).filter(inc => inc.totMissing+inc.totRepetition+inc.totMismatch>0);

    // Render bars for each error category    
    renderDeviationErrorBars(alignments, "missing", "barMissing");
    renderDeviationErrorBars(alignments, "repetition", "barRepetition");
    renderDeviationErrorBars(alignments, "mismatch","barMismatch");
    

    // Render bars for the top 3 wrong traces
    const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
    const sortedData = alignments.sort(sorter);
    //console.log(sortedData);

    // console.log(aa[0].missing);
    //
    // renderDeviationErrorBars(sortedData, "general", "divTopOne");
    // renderDeviationTopErrors(sortedData[1], "divTopTwo");
    // renderDeviationTopErrors(sortedData[2], "divTopThree");

    renderTopTraces(alignments);
    
    // Render checkboxes and state block
    renderCheckboxes(alignments);

}


/* ERROR CATEGORY BLOCK */
function renderDeviationErrorBars(alignments, error, selector){

    
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
    // .domain([0, sumTotal])
    // .range([width, 0])
    .domain([0, sumTotal])
    .range([0, width])

    var y = d3.scaleBand()
    .domain(data.map(d => d.error))
    .range([ height, 0 ])
    .padding([0.2]);

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range([colorDev.N,colorDev.A,colorDev.W,colorDev.R,colorDev.C]);


    // const colorTop = error=="missing" ? colorDev.miss : error=="repetition" ? colorDev.rep : colorDev.mism;
    // svg.append("rect")
    // .attr("y", 0)
    // .attr("x",0)
    // .attr("width",width)
    // .attr("height",height)
    // .attr("style", "fill:"+colorTop);
    // sumTotal>0 && svg.append("text")
    // .attr("y", height/2)
    // .attr("x",width/2)
    // .text(sumTotal);

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

    svg.selectAll("text")
    .data(stackedData)
    .enter()
    .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {return x(d[0][0]); })
        .attr("y", y(error)*4+height)
        .text(function(d) {return d[0][1]-d[0][0] == 0 ? "" : d[0][1]-d[0][0]})
}