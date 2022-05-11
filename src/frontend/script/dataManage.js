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