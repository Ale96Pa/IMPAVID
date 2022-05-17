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


function renderSingleSlider(svg, margin, width, p, i, err){

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
    svg.append("g")
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

        /* TODO: riprendere da qui (dati con i costi) */
        console.log(parData);
      });
    document.getElementById("containerState").appendChild(btn);

}

function renderParamAnalysis(){

    d3.select("#paramFitness").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 300 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    var svg = d3.select("#fitness")
    .append("svg")
    .attr("id", "paramFitness")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("y", 70)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .text(" PRECISION and RECALL ");
}

function renderTraces(){

    d3.select("#paramIncidents").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 300 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    var svg = d3.select("#incident")
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