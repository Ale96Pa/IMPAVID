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

function renderDeviationErrorBars(objDeviations, selectorBar){
    const sumTotal = Object.values(objDeviations).reduce((a, b) => a + b, 0);
    const sumN = objDeviations.N;
    const sumA = objDeviations.A;
    const sumW = objDeviations.W;
    const sumR = objDeviations.R;
    const sumC = objDeviations.C;

    const height = 20;
    const h_gap=10;
    const width = 250;//document.getElementById(selectorBar).offsetWidth;
    console.log(document.getElementById(selectorBar).offsetWidth);

    var svg = d3.select("#"+selectorBar).append("svg")
    .attr("width",width)
    .attr("height",height*3)
    .append("g");
    
    const color = selectorBar.includes("Miss") ? "blue" : selectorBar.includes("Rep") ? "red" : "green";
    var rectTotal = svg.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width",width)
    .attr("height",height)
    .attr("style", "fill:"+color);
    var textTot =sumTotal>0 && svg.append("text")
    .attr("y", (height+h_gap)/2)
    .attr("x",width/2)
    .text(sumTotal);

    const wN = Math.round(sumN*width/sumTotal);
    var rectN = svg.append("rect")
    .attr("y", height+h_gap)
    .attr("x",0)
    .attr("width",wN)
    .attr("height",height)
    .attr("style", "fill:brown");
    var textN =sumN>0 && svg.append("text")
    .attr("y", 2*height+h_gap/2)
    .attr("x",wN/2)
    .text(sumN);

    const wA =  Math.round(sumA*width/sumTotal);
    var rectA = svg.append("rect")
    .attr("y", height+h_gap)
    .attr("x",wN)
    .attr("width",wA)
    .attr("height",height)
    .attr("style", "fill:olive");
    var textA = sumA >0 && svg.append("text")
    .attr("y", 2*height+h_gap/2)
    .attr("x",wN+(wA/2))
    .text(sumA);

    const wW =  Math.round(sumW*width/sumTotal);
    var rectW = svg.append("rect")
    .attr("y", height+h_gap)
    .attr("x",wN+wA)
    .attr("width",wW)
    .attr("height",height)
    .attr("style", "fill:pink");
    var textW =  sumW>0 && svg.append("text")
    .attr("y", 2*height+h_gap/2)
    .attr("x",wN+wA+(wW/2))
    .text(sumW);

    const wR =  Math.round(sumR*width/sumTotal);
    var rectR = svg.append("rect")
    .attr("y", height+h_gap)
    .attr("x",wN+wA+wW)
    .attr("width",wR)
    .attr("height",height)
    .attr("style", "fill:grey");
    var textR = sumR>0 && svg.append("text")
    .attr("y", 2*height+h_gap/2)
    .attr("x",wN+wA+wW+(wR/2))
    .text(sumR);

    const wC =  Math.round(sumC*width/sumTotal);
    var rectC = svg.append("rect")
    .attr("y", height+h_gap)
    .attr("x",wN+wA+wW+wR)
    .attr("width",wC)
    .attr("height",height)
    .attr("style", "fill:black");
    var textC = sumC>0 && svg.append("text")
    .attr("y", 2*height+h_gap/2)
    .attr("x",wN+wA+wW+wR)
    .text(sumC);
}

function renderCheckboxes(){
    checkMissing = document.getElementById('checkMissing');
    checkMissing.addEventListener('change', e => {
        if(e.target.checked){
            console.log(e.target.checked + " missing");
        } else {
            console.log(e.target.checked + " missing");
        }
    });
    checkRepetition = document.getElementById('checkRepetition');
    checkRepetition.addEventListener('change', e => {
        if(e.target.checked){
            console.log(e.target.checked + " repetition");
        } else {
            console.log(e.target.checked + " repetition");
        }
    });
    checkMismatch = document.getElementById('checkMismatch');
    checkMismatch.addEventListener('change', e => {
        if(e.target.checked){
            console.log(e.target.checked + " Mismatch");
        } else {
            console.log(e.target.checked + " Mismatch");
        }
    });
}

function renderDeviationTopErrors(objDeviations, selectorBar){

    // const sumTotal = Object.values(objDeviations).reduce((a, b) => a + b, 0);
    // const sumN = objDeviations.N;
    // const sumA = objDeviations.A;
    // const sumW = objDeviations.W;
    // const sumR = objDeviations.R;
    // const sumC = objDeviations.C;

    const height = 20;
    const h_gap=10;
    const width = 250;//document.getElementById(selectorBar).offsetWidth;

    var svg = d3.select("#"+selectorBar).append("svg")
    .attr("width",width)
    .attr("height",height*3)
    .append("g");
    
    //const color = selectorBar.includes("Miss") ? "blue" : selectorBar.includes("Rep") ? "red" : "green";
    const sumMiss = Object.values(objDeviations.missing).reduce((a, b) => a + b, 0);
    const sumRep = Object.values(objDeviations.repetition).reduce((a, b) => a + b, 0);
    const sumMism = Object.values(objDeviations.mismatch).reduce((a, b) => a + b, 0);
    const sumTot = sumMiss+sumRep+sumMism;
    const wMiss = Math.round(sumMiss*width/sumTot); 
    const wRep = Math.round(sumRep*width/sumTot); 
    const wMism = Math.round(sumMism*width/sumTot); 
    var rectMiss = svg.append("rect")
    .attr("y", 0)
    .attr("x",0)
    .attr("width",wMiss)
    .attr("height",height)
    .attr("style", "fill:blue");
    var rectRep = svg.append("rect")
    .attr("y", 0)
    .attr("x",wMiss)
    .attr("width",wRep)
    .attr("height",height)
    .attr("style", "fill:red");
    var rectMism = svg.append("rect")
    .attr("y", 0)
    .attr("x",wMiss+wRep)
    .attr("width",wMism)
    .attr("height",height)
    .attr("style", "fill:green");

    // const wN = Math.round(sumN*width/sumTotal);
    // var rectN = svg.append("rect")
    // .attr("y", height+h_gap)
    // .attr("x",0)
    // .attr("width",wN)
    // .attr("height",height)
    // .attr("style", "fill:brown");
    // var textN =sumN>0 && svg.append("text")
    // .attr("y", 2*height+h_gap/2)
    // .attr("x",wN/2)
    // .text("N");

    // const wA =  Math.round(sumA*width/sumTotal);
    // var rectA = svg.append("rect")
    // .attr("y", height+h_gap)
    // .attr("x",wN)
    // .attr("width",wA)
    // .attr("height",height)
    // .attr("style", "fill:olive");
    // var textA = sumA >0 && svg.append("text")
    // .attr("y", 2*height+h_gap/2)
    // .attr("x",wN+(wA/2))
    // .text("A");

    // const wW =  Math.round(sumW*width/sumTotal);
    // var rectW = svg.append("rect")
    // .attr("y", height+h_gap)
    // .attr("x",wN+wA)
    // .attr("width",wW)
    // .attr("height",height)
    // .attr("style", "fill:pink");
    // var textW =  sumW>0 && svg.append("text")
    // .attr("y", 2*height+h_gap/2)
    // .attr("x",wN+wA+(wW/2))
    // .text("W");

    // const wR =  Math.round(sumR*width/sumTotal);
    // var rectR = svg.append("rect")
    // .attr("y", height+h_gap)
    // .attr("x",wN+wA+wW)
    // .attr("width",wR)
    // .attr("height",height)
    // .attr("style", "fill:grey");
    // var textR = sumR>0 && svg.append("text")
    // .attr("y", 2*height+h_gap/2)
    // .attr("x",wN+wA+wW+(wR/2))
    // .text("R");

    // const wC =  Math.round(sumC*width/sumTotal);
    // var rectC = svg.append("rect")
    // .attr("y", height+h_gap)
    // .attr("x",wN+wA+wW+wR)
    // .attr("width",wC)
    // .attr("height",height)
    // .attr("style", "fill:black");
    // var textC = sumC>0 && svg.append("text")
    // .attr("y", 2*height+h_gap/2)
    // .attr("x",wN+wA+wW+wR)
    // .text("C");
}

function renderTopTraces(arr){
    const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
    const aa = arr.sort(sorter);
    console.log(aa[0].missing);

    renderDeviationTopErrors(aa[0], "divTopOne");
    renderDeviationTopErrors(aa[1], "divTopTwo");
    renderDeviationTopErrors(aa[2], "divTopThree");
}

async function retrieveAlignment() {
    const alignments = await eel.alignmentsToJson()();
    const alignmentData = Object.entries(JSON.parse(alignments)).map(entry => {
        return {incident_id: entry[0],
            ...entry[1]
        };
    });
    // console.log(alignmentData);
    
    const errorSum = sumErrorsDeviation(alignmentData);

    // console.log(errorSum);

    renderDeviationErrorBars(errorSum.missing, "barMissing");
    renderDeviationErrorBars(errorSum.repetition, "barRepetition");
    renderDeviationErrorBars(errorSum.mismatch, "barMismatch");

    renderCheckboxes();

    renderTopTraces(alignmentData);

    d3.select("body").append("span").text("LOADED");
}