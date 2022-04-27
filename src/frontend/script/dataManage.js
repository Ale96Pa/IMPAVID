// eel.expose(say_hello_js); // Expose this function to Python
// function say_hello_js(x) {
//   console.log("Hello from " + x);
//   return "Hello from " + x;
// }

const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);

function renderBars(data){
    // create svg element:
    var svg = d3.select("#rect").append("svg").attr("width", 800).attr("height", 200)

    // Add the path using this helper function
    svg.append('rect')
    .attr('x', 10)
    .attr('y', 120)
    .attr('width', 600)
    .attr('height', 40)
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2');
}

async function retrieveAlignment() {
    const alignments = await eel.alignmentsToJson()();
    const alignmentJson = JSON.parse(alignments)
    const entries = Object.entries(alignmentJson)
    //console.log(entries);
    data = []
    for(var i=0; i<entries.length; i++){
        const obj = entries[i][1];
        data.push({"error": "repetition", "value": sumValues(obj.repetition)});
    }
    console.log(data);

    /*
    [
        {"error": "missing", "value": 100}
    ]
    */
    d3.select("body").append("span").text(alignments);
}