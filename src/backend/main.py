import procMining as pm
import incidentData as id
import json
import csv

import eel
eel.init("./frontend")

fileLog = "data/dummy_log.csv"
fileModel = "data/base_model.pnml"
csv_file = "data/dummyTraces.csv"

dictAlfaMiss = {"N":0.25,"A":0.25, "W":0, "R":0.25,"C":0.25}
Tmiss = 1
dictAlfaMult = {"N":0.25,"A":0.25,"W":0.2,"R":0.2,"C":0.1}
Tmult = 10
dictAlfaMismatch = {"N":0.35,"A":0.35,"W":0.1,"R":0.1,"C":0.1}
Tmism = 4
dictAlfaCost = {"miss":0.33,"rep":0.34,"mism":0.33}

@eel.expose
def calculateParamCosts(params):
    missDict = params["missing"]
    repDict = params["repetition"]
    mismDict = params["mismatch"]
    wDict = params["weights"]

    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)
        traces = list(reader)
        return pm.compute_deviations(traces, missDict, Tmiss, repDict, Tmult, mismDict, Tmism, wDict, False)

eel.paramsCosts()(calculateParamCosts)

@eel.expose
def processData():
    aligns = pm.compute_trace_alignment(fileLog,fileModel)
    alignments = pm.compute_deviations(aligns, dictAlfaMiss, Tmiss, dictAlfaMult, Tmult, dictAlfaMismatch, Tmism, dictAlfaCost, True)

    incidents = id.formatIncidents(fileLog)

    return [json.dumps(alignments), json.dumps(incidents)]
eel.start('index.html', mode='edge')