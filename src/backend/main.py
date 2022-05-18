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

def convertSeverityToLabel(sev):
    if sev == '1 - Critical' or sev == "critical":
        return 4
    elif sev == '2 - High' or sev == "high":
        return 3
    elif sev == '3 - Moderate' or sev == "medium":
        return 2
    elif sev == '4 - Low' or sev == "low" or sev == "none":
        return 1
    else:
        return 1
    
from sklearn.metrics import precision_recall_fscore_support as score
@eel.expose
def calculateParamCosts(params):
    missDict = params["missing"]
    repDict = params["repetition"]
    mismDict = params["mismatch"]
    wDict = params["weights"]
    predicted = []
    actual = []

    incidents = id.formatIncidents(fileLog)
    # print(incidents)
    for elem in incidents:
            actual.append({"incident_id": elem["incident_id"], "severity": elem["priority"]})

    # with open(fileLog, "r") as flog:
    #     readerLog = csv.DictReader(flog, delimiter=";")
    #     rows = list(readerLog)
    #     for elem in rows:
    #         actual.append({"incident_id": elem["incident_id"], "severity": elem["priority"]})

    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)
        traces = list(reader)
        devs = pm.compute_deviations(traces, missDict, Tmiss, repDict, Tmult, mismDict, Tmism, wDict, False)
        for inc in devs.keys():
            predicted.append({"incident_id": inc, "severity": devs[inc]["severity"]})
        # return pm.compute_deviations(traces, missDict, Tmiss, repDict, Tmult, mismDict, Tmism, wDict, False)

    predicted = sorted(predicted, key=lambda d: d['incident_id'])
    actual = sorted(actual, key=lambda d: d['incident_id'])
    labelPredicted = []
    labelActual = []
    for i in range(0,len(predicted)):
        labelPredicted.append(convertSeverityToLabel(predicted[i]["severity"]))
        labelActual.append(convertSeverityToLabel(actual[i]["severity"]))
    print(labelPredicted, labelActual)
    # print(actual)
    # print(len(predicted), len(actual))

    # predicted = [0, 1, 1, 2, 3] 
    # y_test = [0, 3, 3, 0, 0]

    precision, recall, fscore, support = score(labelActual, labelPredicted)
    print('precision: {}'.format(precision))
    print('recall: {}'.format(recall))
    print('fscore: {}'.format(fscore))
    print('support: {}'.format(support))

eel.paramsCosts()(calculateParamCosts)

@eel.expose
def processData():
    aligns = pm.compute_trace_alignment(fileLog,fileModel)
    alignments = pm.compute_deviations(aligns, dictAlfaMiss, Tmiss, dictAlfaMult, Tmult, dictAlfaMismatch, Tmism, dictAlfaCost, True)

    incidents = id.formatIncidents(fileLog)

    return [json.dumps(alignments), json.dumps(incidents)]
eel.start('index.html', mode='edge')