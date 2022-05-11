function renderMetrics(alignments){

    d3.select("#metrics").selectAll("*").remove();

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 300 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

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
    .attr("font-family", "Helvetica")
    .text("Number of selected incidents: ")
        .append("tspan")
        .attr("font-weight", "bold")
        .text(numIncidents);

    svg.append("text")
    .attr("y", 40)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .text("Average fitness: ")
        .append("tspan")
        .attr("font-weight", "bold")
        .text(avgF);

    svg.append("text")
    .attr("y", 70)
    .attr("x", 0)
    .attr("font-family", "Helvetica")
    .text("Average cost: ")
        .append("tspan")
        .attr("font-weight", "bold")
        .text(avgC);
}