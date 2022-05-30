eel.expose(paramsCosts);
function paramsCosts() {
    return {
        missing: paramMissing,
        repetition: paramRepetition,
        mismatch: paramMismatch,
        weights: paramWeights};
}

function convertEventToAbbr(ev){
    switch(ev){
        case "Missing":
            return "miss";
        case "Repetition":
            return "rep";
        case "Mismatch":
            return "mism";
        case "Detection":
            return "N";
        case "Activation":
            return "A";
        case "Awaiting":
            return "W";
        case "Resolution":
            return "R";
        case "Closure":
            return "C";
        default:
            return "";
    }
}


async function renderSingleSlider(svg, margin, width, p, i, err){

    var def;
    switch(err){
        case "Missing":
            def = paramMissing[convertEventToAbbr(p)];
            break;
        case "Repetition":
            def = paramRepetition[convertEventToAbbr(p)];
            break;
        case "Mismatch":
            def = paramMismatch[convertEventToAbbr(p)];
            break;
        case "Weigths":
            def = paramWeights[convertEventToAbbr(p)];
            break;
        default:
            def = 0;
            break;
    }

    var sliderParam = d3.sliderBottom()
    .min(0)
    .max(1)
    .width(width-100)
    .tickFormat(d3.format('.2'))
    .ticks(10)
    .default(def/*err == "Missing" ? paramMissing[convertEventToAbbr(p)] : err == "Repetition" ? 0.33 : 0.2*/)
    .handle(
      d3.symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .on('end', val => sliderChange(val));

    const yDim = 50*i+2*margin.top;
    const g = svg.append("g")
    .attr("transform", "translate("+ 100 +"," + yDim + ")")
    .attr("height", 40)
    .call(sliderParam);

    svg.append("text")
    .attr("y", yDim+5)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .text(p);

    function sliderChange(val){
        switch(err){
            case "Missing":
                paramMissing[convertEventToAbbr(p)] = val;
                break;
            case "Repetition":
                paramRepetition[convertEventToAbbr(p)] = val;
                break;
            case "Mismatch":
                paramMismatch[convertEventToAbbr(p)] = val;
                break;
            case "Weigths":
                paramWeights[convertEventToAbbr(p)] = val;
                break;
            default:
                break;
        }
    }

    const aa = d3.select(".slider");
    const w = 386/*aa.node().getBoundingClientRect().width;*/

    const x = d3.scaleLinear()
    .domain([0,1]) 
    .range([ 0, w ]);

    const ranges = await eel.rangeParams()();
    var greenRange, xPos;
    if(p == "Detection" && err == "Missing") greenRange = ranges["Nmiss"]
    if(p == "Activation" && err == "Missing") greenRange = ranges["Amiss"]
    if(p == "Resolution" && err == "Missing") greenRange = ranges["Rmiss"]
    if(p == "Closure" && err == "Missing") greenRange = ranges["Cmiss"]

    if(p == "Detection" && err == "Repetition") greenRange = ranges["Nrep"]
    if(p == "Activation" && err == "Repetition") greenRange = ranges["Arep"]
    if(p == "Awaiting" && err == "Repetition") greenRange = ranges["Wrep"]
    if(p == "Resolution" && err == "Repetition") greenRange = ranges["Rrep"]
    if(p == "Closure" && err == "Repetition") greenRange = ranges["Crep"]

    if(p == "Detection" && err == "Mismatch") greenRange = ranges["Nmism"]
    if(p == "Activation" && err == "Mismatch") greenRange = ranges["Amism"]
    if(p == "Awaiting" && err == "Mismatch") greenRange = ranges["Wmism"]
    if(p == "Resolution" && err == "Mismatch") greenRange = ranges["Rmism"]
    if(p == "Closure" && err == "Mismatch") greenRange = ranges["Cmism"]

    /*TODO FARE MEGLIO*/
    var xPos = greenRange ? greenRange.mean>1 ? w-margin.left : x(greenRange.mean) : null;
    var xPosMin = xPos? x(greenRange.mean-greenRange.std) > x(1) ? x(1) : x(greenRange.mean-greenRange.std) : null;
    var xPosMax = xPos ? x(greenRange.mean+greenRange.std) > x(1) ? x(1) : x(greenRange.mean+greenRange.std) : null;
    console.log(greenRange)

    xPos && g.append("rect")
        .attr("width", xPosMin > xPos ? 10 : (xPosMax-xPosMin)-2*margin.left)
        .attr("height", 8)
        .attr("fill", "green")
        .attr("opacity", 0.8)
        .attr("x", xPos-margin.left)
        .attr("y", -4)
        .attr("rx", 20)
        .attr("ry", 20);
}

function renderParamSpace(){

    var margin = {top: 15, right: 10, bottom: 20, left: 10},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    
    const devs = ["Missing", "Repetition", "Mismatch"];
    devs.map(err => {

        d3.select("#paramDeviation"+err).remove();

        var svg = d3.select("#containerState")
        .append("svg")
        .attr("id", "paramDeviation"+err)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("border-style", "dotted");
        
        svg.append("text")
        .attr("y", margin.top)
        .attr("x", (width + margin.left + margin.right)/2)
        .attr("font-family", "Helvetica")
        .text(err);

        const params = err == "Missing" ? ["Detection", "Activation", "Resolution", "Closure"] : ["Detection", "Activation", "Awaiting", "Resolution", "Closure"];
        params.map((p,i) => {
            renderSingleSlider(svg, margin, width, p, i, err);
        });
    });

    d3.select("#paramDeviationWeights").remove();
    d3.select("#btnParam").remove();

    var svgLast = d3.select("#containerState")
        .append("svg")
        .attr("id", "paramDeviationWeights")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom - 100)
        .style("border-style", "dotted");
    
    svgLast.append("text")
    .attr("y", margin.top)
    .attr("x", (width + margin.left + margin.right)/2)
    .attr("font-family", "Helvetica")
    .text("Error weights");

    devs.map((p,i) => {
        renderSingleSlider(svgLast, margin, width, p, i, "Weigths");
    });

    var btn = document.createElement("button");
    btn.id = "btnParam"
    btn.innerHTML = "Submit";
    btn.addEventListener("click", async function () {
        const pars = {
            missing: paramMissing,
            repetition: paramRepetition,
            mismatch: paramMismatch,
            weights: paramWeights}
        const parData = await eel.calculateParamCosts(pars)();

        for(var i=0; i<parData.precision.length; i++){
            var sev;
            switch(i){
                case 0:
                    sev = "low";
                    break;
                case 1:
                    sev = "medium";
                    break;
                case 2:
                    sev = "high";
                    break;
                default:
                    sev = "critical";
                    break;
            }
            modelMetrics.push({severity:sev, precision:parData.precision[i], recall:parData.recall[i]})
        }

        renderParamAnalysis()

      });
    document.getElementById("containerState").appendChild(btn);

}

function renderParamAnalysis(){

    d3.select("#paramFitness").remove();

    var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#pattern")
    .append("svg")
    .attr("id", "paramFitness")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // group the data: I want to draw one line per group
    const sumstat = d3.group(modelMetrics, d => d.severity);

    // Add X axis --> recall
    var x = d3.scaleLinear()
    .domain([0,1]/*d3.extent(modelMetrics, function(d) { return d.recall; })*/) //0,1
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height + margin.top + 10)
        .text("recall");

    // Add Y axis --> precision
    var y = d3.scaleLinear()
    .domain([0, 1/*d3.max(modelMetrics, function(d) { return +d.precision; })*/]) //0,1
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("precision");

    // color palette
    var color = d3.scaleOrdinal()
    .range([colorSeverity.low,colorSeverity.medium,colorSeverity.high,colorSeverity.critical])

    // Draw legend
    var legend_keys = ["low", "medium", "high", "critical"]

    var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
        .enter().append("g")
        .attr("class","lineLegend")
        .attr("transform", function (d,i) {
                return "translate(" + (width-50) + "," + (i*20)+")"; //todo aggiustare
            });

    lineLegend.append("text").text(function (d) {return d;})
        .attr("transform", "translate(15,9)"); //align texts with boxes

    lineLegend.append("rect")
        .attr("fill", function (d, i) {return color(d); })
        .attr("width", 10).attr("height", 10);

    // Draw the line
    var lines = svg.selectAll(".line")
    .data(sumstat);

    lines.exit().remove();

    lines.enter().append("path")
    .attr("fill", "none")
    .attr("stroke", function(d){ return color(d[0]) })
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
        return d3.line()
        .x(function(d) {return x(d.recall); })
        .y(function(d) {return y(+d.precision); })
        (d[1])
    })

}

function renderTraces(){

    d3.select("#paramIncidents").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 300 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    var svg = d3.select("#detail")
    .append("svg")
    .attr("id", "paramIncidents")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("y", 70)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .text(" TRACCE ORDINATE IN BASE AL COSTO ");
}