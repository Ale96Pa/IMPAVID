function foo(svg, margin, width, p,i){
    
    var x = d3.scaleLinear()
        .domain([0,1])
        .range([0, width-100]);

    var brush = d3.brushX()
    .extent([[0,0], [width-100,30]])
    .on("brush", brushSlider);

    const yDim = 50*i+margin.top;
    svg.append("g")
    .attr("transform", "translate("+ 100 +"," + yDim + ")")
    .attr("height", 40)
    .call(d3.axisBottom(x))
    .call(brush);

    svg.append("text")
    .attr("y", yDim)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .text(p);

    function brushSlider({selection}) {
        selectedRange = selection.map(x.invert, x);;
        console.log(p, selectedRange);
      }

}

function renderParamSpace(){

    d3.select("#paramDeviation").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 500 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

    var svg = d3.select("#containerState")
    .append("svg")
    .attr("id", "paramDeviation")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

    const params = ["Alpha", "Beta", "Gamma", "Delta"];
    params.map((p,i) => {
        foo(svg, margin, width, p,i);
    });
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