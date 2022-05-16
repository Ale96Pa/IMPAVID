function removeAllFromParameters(){
    // Remove parameters elements
    d3.select("#paramDeviation").remove();
    d3.select("#paramFitness").remove();
    d3.select("#paramIncidents").remove();

    // Adjust display styles
    document.getElementById("legend").style.display = "";
    document.getElementById("containerDev").style.display = "table";
    document.getElementById("containerTop").style.display = "";
    document.getElementById("containerState").style.overflowY = "scroll";
    document.getElementById("container_bottom").style.display = "flex";
}

function removeAllFromExploration(){
    // Remove deviation
    d3.select("#barMissing").selectAll("*").remove();
    d3.select("#barRepetition").selectAll("*").remove();
    d3.select("#barMismatch").selectAll("*").remove();
    d3.select("#divTopOne").selectAll("*").remove();
    d3.select("#divTopTwo").selectAll("*").remove();
    d3.select("#divTopThree").selectAll("*").remove();
    d3.select("#stateDeviations").selectAll("*").remove();

    // Remove fitness
    d3.select("#fitnessViolin").selectAll("*").remove();
    d3.select("#fitnessBar").selectAll("*").remove();
    d3.select("#costViolin").selectAll("*").remove();
    d3.select("#costBar").selectAll("*").remove();

    // Remove incidents
    d3.select("#parallelIncidents").selectAll("*").remove();
    d3.select("#barIncidents").selectAll("*").remove();

    // Remove patterns
    d3.select("#patternChart").selectAll("*").remove();

    // Adjust display styles
    document.getElementById("containerDev").style.display = "none";
    document.getElementById("containerTop").style.display = "none";
    document.getElementById("containerState").style.overflow = "hidden";
    document.getElementById("container_bottom").style.display = "none";
    document.getElementById("legend").style.display = "none";
}

function combineFilters(alignmentsData, incidentsData){

    filteredAlignmentsData = filterError(alignmentsData, selectedErrors);
    filteredAlignmentsData = filterActivities(filteredAlignmentsData, selectedActivities);
    filteredAlignmentsData = filterBrushes(filteredAlignmentsData, fitnessRange, "fitness");
    filteredAlignmentsData = filterBrushes(filteredAlignmentsData, costRange, "costTotal");
    
    filteredIncidentsData = filterDate(dateRange, incidentsData);
    
    filteredAlignmentsData = filterAlignmentsByCategory(filteredAlignmentsData, filteredIncidentsData, selectedCategories);

    filteredIncidentsData = filterIncidentsByAlignments(filteredAlignmentsData, incidentsData);
    filteredAlignmentsData = filterAlignmentsByIncidents(alignmentsData, filteredIncidentsData);
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

function filterActivities(data, activityFilter){
    const activityIN = Object.keys(activityFilter).reduce((acc, elem) => {
        if(activityFilter[elem]) return [...acc, elem]
        else return acc;
    }, []);
    const activityOUT = Object.keys(activityFilter).filter(x => !activityIN.includes(x));

    if(activityIN.length === 0) return data;
    else {
        return data.filter(elem => {
            const eventList = elem.alignment.split(";").filter(e => !e.includes("M")).map(el => el.split("]")[1]).slice(0, -1);
            if(activityIN.some(e => !eventList.includes(e.toUpperCase())) || activityOUT.some(e => eventList.includes(e.toUpperCase()))) return false;
            else return true;
        });
    }
}

function filterBrushes(data, rangeFilter, brushType){
    return data.filter(elem => {
        return elem[brushType]<=rangeFilter[0] && elem[brushType]>=rangeFilter[1]
    });
}

function filterAlignmentsByCategory(alignment, incidents, selectedCat){
    const listFilteredInc = incidents.reduce((acc, elem) => {
        if(selectedCat.includes(elem.category)){
            acc.push(elem.incident_id);
        }
        return acc;
    }, []);
    return alignment.filter(elem => {
        return listFilteredInc.includes(elem.incident_id);
    })
}

function filterDate(rangeDate, incidents){
    return incidents.filter(elem => {
        const endRange = new Date(rangeDate[1]);
        const startRange = new Date(rangeDate[0]);
        const start = new Date(elem.openTs.replace(/(\d+[/])(\d+[/])/, '$2$1'));
        const end = new Date(elem.closeTs.replace(/(\d+[/])(\d+[/])/, '$2$1'));
        return (start <= endRange && start >= startRange) || (end <= endRange && end >= startRange);
    })
}