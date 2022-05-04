function renderRadviz(data,selector){
    // // set the dimensions and margins of the graph
    // var margin = {top: 10, right: 30, bottom: 20, left: 50},
    //     width = 460 - margin.left - margin.right,
    //     height = 200 - margin.top - margin.bottom;

    // // append the svg object to the body of the page
    // var svg = d3.select("#"+selector)
    // .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")");


    // svg.append("rect")
    // .attr("y", h_gap)
    // .attr("x",0)
    // .attr("width",wMiss)
    // .attr("height",height)
    // .attr("style", "fill:"+colorDev.miss);

    



    const radviz = d3.radviz()
    
    radviz.data(data)
    const set = radviz.data().dimensions.map(d => d.values)
    // let prova = function(_) {
    //     console.log("I have connected the fuction to the click action on a point in radviz", _)
    // }
    // radviz.setFunctionClick(prova)
    // let results1 = function(error_value) {
    //     document.getElementById('menu1').innerHTML = ' <b>Effectiveness Error</b>: ' + error_value.toFixed(4)
    // }
    // radviz.setFunctionUpdateResults(results1)
    //radviz.setRightClick(false)
    //radviz.disableDraggableAnchors(false)
    //radviz.setDefaultColorPoints('purple')
    
    
    d3.select('#'+selector).call(radviz)


    // const radviz1 = d3.radviz()
    // d3.csv('data/12-CSM.csv').then(dataset => {
    //     radviz1.data(dataset)
    //     const set = radviz1.data().dimensions.map(d => d.values)
    //     d3.select('#container1').call(radviz1)
    // })
    // const radviz2 = d3.radviz()
    // d3.csv('data/12-CSM.csv').then(dataset => {
    //     radviz2.data(dataset)
    //     const set = radviz2.data().dimensions.map(d => d.values)
    //     d3.select('#container2').call(radviz2)
    // })
    // const radviz3 = d3.radviz()
    // d3.csv('data/12-CSM.csv').then(dataset => {
    //     radviz3.data(dataset)
    //     const set = radviz3.data().dimensions.map(d => d.values)

    //     d3.select('#container3').call(radviz3)
    // })
}

async function renderPattern() {
    const incidents = await eel.incidentsToJson()();
    const formatIncidents = JSON.parse(incidents)

    const a = formatIncidents.map(elem => {
        return {
            ...elem,
            impact: parseInt(elem.impact.split(" ")[0]),
            urgency: parseInt(elem.urgency.split(" ")[0]),
            priority: parseInt(elem.priority.split(" ")[0])
        }
    })

    renderRadviz(a, "patternChart")

    d3.select("body").append("span").text("LOADED-PATTERNS");
}