function renderMetrics(alignments){

    d3.select("#metrics").selectAll("*").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 300 - margin.left - margin.right,
    height = 60 - margin.top - margin.bottom;


    // Calculate number of incidents
    const numIncidents = alignments.length;

    // Calculate average fitness
    const avgF = (alignments.reduce((acc,e) => {return acc + e.fitness},0)/numIncidents).toFixed(3);;

    // Calculate average cost
    const avgC = (alignments.reduce((acc,e) => {return acc + e.costTotal},0)/numIncidents).toFixed(3);;

    var svg = d3.select("#metrics")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("y", 10)
    .attr("x", 0)
    .text("Number of incidents: "+numIncidents);

    svg.append("text")
    .attr("y", 30)
    .attr("x", 0)
    .text("Average fitness: "+avgF);

    svg.append("text")
    .attr("y", 50)
    .attr("x", 0)
    .text("Average cost: "+avgC);
}