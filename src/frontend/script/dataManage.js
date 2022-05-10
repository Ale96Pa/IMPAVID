function filterError(data, errorFilter){
    return data.filter(function(elem) {
        if(errorFilter.missing && errorFilter.repetition && errorFilter.mismatch){
            return elem.totMissing>0 && elem.totRepetition>0 && elem.totMismatch>0
        }
        else if(errorFilter.missing && errorFilter.repetition){
            return elem.totMissing>0 && elem.totRepetition>0 && elem.totMismatch<=0
        }
        else if(errorFilter.missing && errorFilter.mismatch){
            return elem.totMissing>0 && elem.totMismatch>0 && elem.totRepetition<=0
        }
        else if(errorFilter.repetition && errorFilter.mismatch){
            return elem.totRepetition>0 && elem.totMismatch>0 && elem.totMissing<=0
        }
        else if(errorFilter.missing){
            return elem.totMissing>0 && elem.totRepetition<=0 && elem.totMismatch<=0
        }
        else if(errorFilter.repetition){
            return elem.totRepetition>0 && elem.totMissing<=0 && elem.totMismatch<=0
        }
        else if(errorFilter.mismatch){
            return elem.totMismatch>0 && elem.totMissing<=0 && elem.totRepetition<=0
        }
        else{
            return true
        }
    });
}

// TODO
function filterActivities(data, activityFilter){
    return data.filter(elem => {
        Object.keys(selectedErrors).forEach(err => {
            Object.keys(activityFilter).forEach(act => {
                if(selectedErrors[err] && activityFilter[act] && elem.missing[act.toUpperCase()]<0){
                    return false;
                }
            })
        })
        return true;
    });
}

function filterBrushes(data, rangeFilter, brushType){
    return data.filter(elem => {
        return elem[brushType]<=rangeFilter[0] && elem[brushType]>=rangeFilter[1]
    });
}

function filterAlignmentsByCategory(alignment, incidents, selectedCat){
    var listFilteredInc = incidents.reduce((acc, elem) => {
        if(selectedCat.includes(elem.category)){
            acc.push(elem.incident_id);
        }
        return acc;
    }, []);
    return alignment.filter(elem => {
        return listFilteredInc.includes(elem.incident_id);
    })
}

function filterIncidentsByAlignments(alignment, incidents){
    return incidents.filter(elem => {
        return alignment.map(e => e.incident_id).includes(elem.incident_id);
    });
}

function filterAlignmentsByIncidents(alignment, incidents){
    return alignment.filter(elem => {
        return incidents.map(e => e.incident_id).includes(elem.incident_id);
    });
}

function filterData(rangeDate, incidents){
    return incidents.filter(elem => {
        var endRange = new Date(rangeDate[1]);
        var startRange = new Date(rangeDate[0]);
        var start = new Date(elem.openTs.replace(/(\d+[/])(\d+[/])/, '$2$1'));
        var end = new Date(elem.closeTs.replace(/(\d+[/])(\d+[/])/, '$2$1'));
        return (start <= endRange && start >= startRange) || (end <= endRange && end >= startRange);
    })
}


// // eel.expose(say_hello_js); // Expose this function to Python
// // function say_hello_js(x) {
// //   console.log("Hello from " + x);
// //   return "Hello from " + x;
// // }


// // const colorDev = { miss: "#bebada", rep: "#fdb462", mism: "#8dd3c7",
// //                 n:"#80b1d3", a:"#b3de69", w:"#fb8072",r:"#fccde5",c:"#ffffb3"};

// function sumErrorsDeviation(data){
//     const sumMissing = data.reduce((accumulator, object) => {
//         return {
//             N: accumulator.N + object.missing.N,
//             A: accumulator.A + object.missing.A,
//             W: accumulator.W + (object.missing.W || 0),
//             R: accumulator.R + object.missing.R,
//             C: accumulator.C + object.missing.C,
//         }
//     }, {N:0, A:0, W:0, R:0, C:0});

//     const sumRepetition = data.reduce((accumulator, object) => {
//         return {
//             N: accumulator.N + object.repetition.N,
//             A: accumulator.A + object.repetition.A,
//             W: accumulator.W + (object.repetition.W || 0),
//             R: accumulator.R + object.repetition.R,
//             C: accumulator.C + object.repetition.C,
//         }
//     }, {N:0, A:0, W:0,R:0, C:0});

//     const sumMismatch = data.reduce((accumulator, object) => {
//         return {
//             N: accumulator.N + object.mismatch.N,
//             A: accumulator.A + object.mismatch.A,
//             W: accumulator.W + (object.mismatch.W || 0),
//             R: accumulator.R + object.mismatch.R,
//             C: accumulator.C + object.mismatch.C,
//         }
//     }, {N:0, A:0, W:0, R:0, C:0});

//     return {missing:sumMissing, repetition:sumRepetition, mismatch: sumMismatch};
// }

// function renderDeviationErrorBars(objDeviations, selectorBar){
//     const sumTotal = Object.values(objDeviations).reduce((a, b) => a + b, 0);
//     const sumN = objDeviations.N;
//     const sumA = objDeviations.A;
//     const sumW = objDeviations.W;
//     const sumR = objDeviations.R;
//     const sumC = objDeviations.C;

//     const height = 20;
//     const h_gap=10;
//     const width = 250;//document.getElementById(selectorBar).offsetWidth;
//     //console.log(document.getElementById(selectorBar).offsetWidth);


//     var svg = d3.select("#"+selectorBar).append("svg")
//     .attr("width",width)
//     .attr("height",height*3)
//     .append("g");
    
//     const color = selectorBar.includes("Miss") ? colorDev.miss : selectorBar.includes("Rep") ? colorDev.rep : colorDev.mism;
//     var rectTotal = svg.append("rect")
//     .attr("y", 0)
//     .attr("x",0)
//     .attr("width",width)
//     .attr("height",height)
//     .attr("style", "fill:"+color);
//     var textTot =sumTotal>0 && svg.append("text")
//     .attr("y", (height+h_gap)/2)
//     .attr("x",width/2)
//     .text(sumTotal);

//     const wN = Math.round(sumN*width/sumTotal);
//     var rectN = svg.append("rect")
//     .attr("y", height+h_gap)
//     .attr("x",0)
//     .attr("width",wN)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.n);
//     var textN =sumN>0 && svg.append("text")
//     .attr("y", 2*height+h_gap/2)
//     .attr("x",wN/2)
//     .text(sumN);

//     const wA =  Math.round(sumA*width/sumTotal);
//     var rectA = svg.append("rect")
//     .attr("y", height+h_gap)
//     .attr("x",wN)
//     .attr("width",wA)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.a);
//     var textA = sumA >0 && svg.append("text")
//     .attr("y", 2*height+h_gap/2)
//     .attr("x",wN+(wA/2))
//     .text(sumA);

//     const wW =  Math.round(sumW*width/sumTotal);
//     var rectW = svg.append("rect")
//     .attr("y", height+h_gap)
//     .attr("x",wN+wA)
//     .attr("width",wW)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.w);
//     var textW =  sumW>0 && svg.append("text")
//     .attr("y", 2*height+h_gap/2)
//     .attr("x",wN+wA+(wW/2))
//     .text(sumW);

//     const wR =  Math.round(sumR*width/sumTotal);
//     var rectR = svg.append("rect")
//     .attr("y", height+h_gap)
//     .attr("x",wN+wA+wW)
//     .attr("width",wR)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.r);
//     var textR = sumR>0 && svg.append("text")
//     .attr("y", 2*height+h_gap/2)
//     .attr("x",wN+wA+wW+(wR/2))
//     .text(sumR);

//     const wC =  Math.round(sumC*width/sumTotal);
//     var rectC = svg.append("rect")
//     .attr("y", height+h_gap)
//     .attr("x",wN+wA+wW+wR)
//     .attr("width",wC)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.c);
//     var textC = sumC>0 && svg.append("text")
//     .attr("y", 2*height+h_gap/2)
//     .attr("x",wN+wA+wW+wR)
//     .text(sumC);
// }

// function renderCheckboxes(arr){
//     const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
//     arr = arr.sort(sorter);

//     for(var i=0;i<arr.length;i++){
//         renderDeviationTopErrors(arr[i],"divCheckedDeviations")
//     }

//     var checkboxes = document.querySelectorAll("input[type=checkbox][name=checkDeviations]");
//     let enabledSettings = []

//     // Use Array.forEach to add an event listener to each checkbox.
//     checkboxes.forEach(function(checkbox) {
//     checkbox.addEventListener('change', function() {
//         enabledSettings = 
//         Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
//         .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
//         .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
        
//         const filterMiss = enabledSettings.includes("missing") ? arr.filter(elem => elem.totMissing > 0) : arr;
//         const filterRep = enabledSettings.includes("repetition") ? filterMiss.filter(elem => elem.totRepetition>0) : filterMiss;
//         const filterMism = enabledSettings.includes("mismatch") ? filterRep .filter(elem => elem.totMismatch>0) : filterRep;

//         // MIGLIORARE FILTRO !!!
//         fiteredRes= arr.filter(function(elem) {
//             if(enabledSettings.includes("missing") && enabledSettings.includes("repetition") && enabledSettings.includes("mismatch")){
//                 return elem.totMissing>0 && elem.totRepetition>0 && elem.totMismatch>0
//             }
//             else if(enabledSettings.includes("missing") && enabledSettings.includes("repetition")){
//                 return elem.totMissing>0 && elem.totRepetition>0 && elem.totMismatch<=0
//             }
//             else if(enabledSettings.includes("missing") && enabledSettings.includes("mismatch")){
//                 return elem.totMissing>0 && elem.totMismatch>0 && elem.totRepetition<=0
//             }
//             else if(enabledSettings.includes("repetition") && enabledSettings.includes("mismatch")){
//                 return elem.totRepetition>0 && elem.totMismatch>0 && elem.totMissing<=0
//             }
//             else if(enabledSettings.includes("missing")){
//                 return elem.totMissing>0 && elem.totRepetition<=0 && elem.totMismatch<=0
//             }
//             else if(enabledSettings.includes("repetition")){
//                 return elem.totRepetition>0 && elem.totMissing<=0 && elem.totMismatch<=0
//             }
//             else if(enabledSettings.includes("mismatch")){
//                 return elem.totMismatch>0 && elem.totMissing<=0 && elem.totRepetition<=0
//             }
//             else{
//                 return true
//             }
//           });

//         // console.log(enabledSettings);
//         const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
//         fiteredRes = fiteredRes.sort(sorter);
//         //console.log(fiteredRes);

//         d3.select("#divCheckedDeviations").selectAll("*").remove();
//         for(var i=0;i<fiteredRes.length;i++){
//             renderDeviationTopErrors(fiteredRes[i],"divCheckedDeviations")
//         }
//     })
//     });


// }

// function renderDeviationTopErrors(objDeviations, selectorBar){

//     // const sumTotal = Object.values(objDeviations).reduce((a, b) => a + b, 0);
//     // const sumN = objDeviations.N;
//     // const sumA = objDeviations.A;
//     // const sumW = objDeviations.W;
//     // const sumR = objDeviations.R;
//     // const sumC = objDeviations.C;

//     const height = 20;
//     const h_gap=25;
//     const width = 450;//document.getElementById(selectorBar).offsetWidth;

//     var svg = d3.select("#"+selectorBar).append("svg")
//     .attr("width",width)
//     .attr("height",height*3)
//     .append("g");
    
//     //const color = selectorBar.includes("Miss") ? "blue" : selectorBar.includes("Rep") ? "red" : "green";
//     const sumMiss = Object.values(objDeviations.missing).reduce((a, b) => a + b, 0);
//     const sumRep = Object.values(objDeviations.repetition).reduce((a, b) => a + b, 0);
//     const sumMism = Object.values(objDeviations.mismatch).reduce((a, b) => a + b, 0);
//     const sumTot = sumMiss+sumRep+sumMism;
//     const wMiss = Math.round(sumMiss*width/sumTot); 
//     const wRep = Math.round(sumRep*width/sumTot); 
//     const wMism = Math.round(sumMism*width/sumTot);

//     var textInc = svg.append("text")
//     .attr("y",h_gap-5)
//     .attr("x",0)
//     .text(objDeviations.incident_id);

//     var rectMiss = svg.append("rect")
//     .attr("y", h_gap)
//     .attr("x",0)
//     .attr("width",wMiss)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.miss);
//     var textTotMiss =sumMiss>0 && svg.append("text")
//     .attr("y", height*2/3+h_gap)
//     .attr("x",wMiss/2)
//     .text(sumMiss);

//     var rectRep = svg.append("rect")
//     .attr("y", h_gap)
//     .attr("x",wMiss)
//     .attr("width",wRep)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.rep);
//     var textTotRep =sumRep>0 && svg.append("text")
//     .attr("y", height*2/3+h_gap)
//     .attr("x",wMiss+(wRep/2))
//     .text(sumRep);

//     var rectMism = svg.append("rect")
//     .attr("y", h_gap)
//     .attr("x",wMiss+wRep)
//     .attr("width",wMism)
//     .attr("height",height)
//     .attr("style", "fill:"+colorDev.mism);
//     var textTotMism =sumMism>0 && svg.append("text")
//     .attr("y", height*2/3+h_gap)
//     .attr("x",wMiss+wRep+(wMism/2))
//     .text(sumMism);

//     // const wN = Math.round(sumN*width/sumTotal);
//     // var rectN = svg.append("rect")
//     // .attr("y", height+h_gap)
//     // .attr("x",0)
//     // .attr("width",wN)
//     // .attr("height",height)
//     // .attr("style", "fill:brown");
//     // var textN =sumN>0 && svg.append("text")
//     // .attr("y", 2*height+h_gap/2)
//     // .attr("x",wN/2)
//     // .text("N");

//     // const wA =  Math.round(sumA*width/sumTotal);
//     // var rectA = svg.append("rect")
//     // .attr("y", height+h_gap)
//     // .attr("x",wN)
//     // .attr("width",wA)
//     // .attr("height",height)
//     // .attr("style", "fill:olive");
//     // var textA = sumA >0 && svg.append("text")
//     // .attr("y", 2*height+h_gap/2)
//     // .attr("x",wN+(wA/2))
//     // .text("A");

//     // const wW =  Math.round(sumW*width/sumTotal);
//     // var rectW = svg.append("rect")
//     // .attr("y", height+h_gap)
//     // .attr("x",wN+wA)
//     // .attr("width",wW)
//     // .attr("height",height)
//     // .attr("style", "fill:pink");
//     // var textW =  sumW>0 && svg.append("text")
//     // .attr("y", 2*height+h_gap/2)
//     // .attr("x",wN+wA+(wW/2))
//     // .text("W");

//     // const wR =  Math.round(sumR*width/sumTotal);
//     // var rectR = svg.append("rect")
//     // .attr("y", height+h_gap)
//     // .attr("x",wN+wA+wW)
//     // .attr("width",wR)
//     // .attr("height",height)
//     // .attr("style", "fill:grey");
//     // var textR = sumR>0 && svg.append("text")
//     // .attr("y", 2*height+h_gap/2)
//     // .attr("x",wN+wA+wW+(wR/2))
//     // .text("R");

//     // const wC =  Math.round(sumC*width/sumTotal);
//     // var rectC = svg.append("rect")
//     // .attr("y", height+h_gap)
//     // .attr("x",wN+wA+wW+wR)
//     // .attr("width",wC)
//     // .attr("height",height)
//     // .attr("style", "fill:black");
//     // var textC = sumC>0 && svg.append("text")
//     // .attr("y", 2*height+h_gap/2)
//     // .attr("x",wN+wA+wW+wR)
//     // .text("C");
// }

// function renderTopTraces(arr){
//     const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
//     const aa = arr.sort(sorter);
//     // console.log(aa[0].missing);

//     renderDeviationTopErrors(aa[0], "divTopOne");
//     renderDeviationTopErrors(aa[1], "divTopTwo");
//     renderDeviationTopErrors(aa[2], "divTopThree");
// }

// async function retrieveAlignment() {
//     const alignments = await eel.alignmentsToJson()();
//     const alignmentData = Object.entries(JSON.parse(alignments)).map(entry => {
//         return {incident_id: entry[0],
//             ...entry[1]
//         };
//     }).filter(inc => inc.totMissing+inc.totRepetition+inc.totMismatch>0);
    
//     //console.log(alignmentData);
    
//     const errorSum = sumErrorsDeviation(alignmentData);

//     // console.log(errorSum);

//     renderDeviationErrorBars(errorSum.missing, "barMissing");
//     renderDeviationErrorBars(errorSum.repetition, "barRepetition");
//     renderDeviationErrorBars(errorSum.mismatch, "barMismatch");

//     renderCheckboxes(alignmentData);

//     renderTopTraces(alignmentData);

//     // const sorter = (a, b) => a.totMissing+a.totRepetition+a.totMismatch < b.totMissing+b.totRepetition+b.totMismatch ? 1 : -1;
//     // const aa = arr.sort(sorter);
    

//     d3.select("body").append("span").text("LOADED");
// }