// eel.expose(say_hello_js); // Expose this function to Python
// function say_hello_js(x) {
//   console.log("Hello from " + x);
//   return "Hello from " + x;
// }

function sumErrorsDeviation(data){
    const sumMissing = data.reduce((accumulator, object) => {
        return {
            N: accumulator.N + object.missing.N,
            A: accumulator.A + object.missing.A,
            W: accumulator.W + (object.missing.W || 0),
            R: accumulator.R + object.missing.R,
            C: accumulator.C + object.missing.C,
        }
    }, {N:0, A:0, W:0, R:0, C:0});

    const sumRepetition = data.reduce((accumulator, object) => {
        return {
            N: accumulator.N + object.repetition.N,
            A: accumulator.A + object.repetition.A,
            W: accumulator.W + (object.repetition.W || 0),
            R: accumulator.R + object.repetition.R,
            C: accumulator.C + object.repetition.C,
        }
    }, {N:0, A:0, W:0,R:0, C:0});

    const sumMismatch = data.reduce((accumulator, object) => {
        return {
            N: accumulator.N + object.mismatch.N,
            A: accumulator.A + object.mismatch.A,
            W: accumulator.W + (object.mismatch.W || 0),
            R: accumulator.R + object.mismatch.R,
            C: accumulator.C + object.mismatch.C,
        }
    }, {N:0, A:0, W:0, R:0, C:0});

    return {missing:sumMissing, repetition:sumRepetition, mismatch: sumMismatch};
}

function renderDeviationErrorBars(objDeviations, selector){
    const sumTotal = Object.values(objDeviations).reduce((a, b) => a + b, 0);
    const sumN = objDeviations.N;
    const sumA = objDeviations.A;
    const sumW = objDeviations.W;
    const sumR = objDeviations.R;
    const sumC = objDeviations.C;

    const height = 20;
    const width = 950;

    var svgContainerMissing = d3.select(selector).append("svg")
    .attr("width",width)
    .attr("height",height*3)
    .append("g"); 

    var rectangleMissing = svgContainerMissing.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width",sumTotal)
    .attr("height",height)
    .attr("style", "fill:blue");

    var rectMissN = svgContainerMissing.append("rect")
    .attr("y", 30)
    .attr("x",0)
    .attr("width",sumN)
    .attr("height",height)
    .attr("style", "fill:red");
    var textN =sumN>0 && svgContainerMissing.append("text")
    .attr("y", 30+(30/2))
    .attr("x",sumN/2)
    .text("N");

    var rectMissA = svgContainerMissing.append("rect")
    .attr("y", 30)
    .attr("x",sumN)
    .attr("width",sumA)
    .attr("height",height)
    .attr("style", "fill:green");
    var textA = sumA >0 && svgContainerMissing.append("text")
    .attr("y", 30+(30/2))
    .attr("x",sumN)
    .text("A");

    var rectMissW = svgContainerMissing.append("rect")
    .attr("y", 30)
    .attr("x",sumN+sumA)
    .attr("width",sumW)
    .attr("height",height)
    .attr("style", "fill:pink");
    var textW = sumW>0 && svgContainerMissing.append("text")
    .attr("y", 30+(30/2))
    .attr("x",sumN+sumA)
    .text("W");

    var rectMissR = svgContainerMissing.append("rect")
    .attr("y", 30)
    .attr("x",sumN+sumA+sumW)
    .attr("width",sumR)
    .attr("height",height)
    .attr("style", "fill:grey");
    var textR = sumR>0 && svgContainerMissing.append("text")
    .attr("y", 30+(30/2))
    .attr("x",sumN+sumA+sumW)
    .text("R");

    var rectMissC = svgContainerMissing.append("rect")
    .attr("y", 30)
    .attr("x",sumN+sumA+sumW+sumR)
    .attr("width",sumC)
    .attr("height",height)
    .attr("style", "fill:black");
    var textC = sumC>0 && svgContainerMissing.append("text")
    .attr("y", 30+(30/2))
    .attr("x",sumN+sumA+sumW+sumR)
    .text("C");
}

async function retrieveAlignment() {
    const alignments = await eel.alignmentsToJson()();
    const alignmentData = Object.entries(JSON.parse(alignments)).map(entry => {
        return {incident_id: entry[0],
            ...entry[1]
        };
    });
    
    const errorSum = sumErrorsDeviation(alignmentData);

    console.log(errorSum);

    renderDeviationErrorBars(errorSum.missing, "#divMissing");
    renderDeviationErrorBars(errorSum.repetition, "#divRepetition");
    renderDeviationErrorBars(errorSum.mismatch, "#divMismatch");

    d3.select("body").append("span").text("LOADED");
}