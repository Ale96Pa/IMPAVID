import pandas as pd
import pm4py
import json
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.petri_net.importer import importer as pnml_importer
from pm4py.algo.conformance.alignments.petri_net import algorithm as alignments

import devDetection as dd
import utilsPM as upm

import eel
eel.init("./frontend")

fileLog = "data/dummy_log.csv"
fileModel = "data/base_model.pnml"

"""
This function gets event log from csv file
"""
def getCsvLog(inputFile):
    log_csv = pd.read_csv(inputFile, sep=';')
    log_csv = pm4py.format_dataframe(log_csv, case_id='incident_id', activity_key='event', timestamp_key='timestamp')
    log_csv = dataframe_utils.convert_timestamp_columns_in_df(log_csv)
    event_log = log_converter.apply(log_csv)
    return event_log

"""
The function format the results of the trace alignment into a dataframe containing:
List of incidents, Alignment trace structure, Trace Fitness
"""
def compute_trace_alignment(inputFile, modelFile):
    resAlignments = []

    log = getCsvLog(inputFile)
    model_net, initial_marking, final_marking = pnml_importer.apply(modelFile)
    aligned_traces = alignments.apply_log(log, model_net, initial_marking, final_marking)

    i=0
    for trace in aligned_traces:
        traceFormat = ""
        for events in trace["alignment"]:
            if events[0] == events[1]:
                traceFormat+="[S]"+events[0]
            elif events[0] == ">>":
                traceFormat+="[M]"+events[1]
            elif events[1] == ">>":
                traceFormat+="[L]"+events[0]
            traceFormat+=";"

        resAlignments.append({
            "incident_id": log[i].__getitem__(0)["incident_id"],
            "alignment": traceFormat,
            "fitness": trace["fitness"],
            "cost": trace["cost"],
            "visited_states": trace["visited_states"],
            "traversed_arcs": trace["traversed_arcs"]
        })
        i+=1
    return resAlignments

"""
This function computes the deviation on the alignments and collect data about error categories
of missing, repetition and mismatch
"""
def compute_deviations(traces):
    deviationsDict = {}
    for elem in traces:
        trace = upm.convertTraceList(elem["alignment"])
        resMissing = dd.detectMissing(trace)
        resRepetition = dd.detectMutliple(trace)
        resMismatch = dd.detectMismatch(trace)

        deviationsDict[elem["incident_id"]] = {
            "alignment": elem["alignment"],
            "fitness": elem["fitness"],
            "cost": elem["cost"],
            "visited_states": elem["visited_states"],
            "traversed_arcs": elem["traversed_arcs"],
            "missing": resMissing,
            "repetition": resRepetition,
            "mismatch": resMismatch
        }
    return deviationsDict


@eel.expose
def alignmentsToJson():
    aligns = compute_trace_alignment(fileLog,fileModel)
    fullData = compute_deviations(aligns)
    return json.dumps(fullData)
eel.start('index.html', mode='edge')

# if __name__ == "__main__":
#     traces = compute_trace_alignment(fileLog,fileModel)
#     fullDict = compute_deviations(traces)
