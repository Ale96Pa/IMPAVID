import procMining as pm
import incidentData as id
import json

import eel
eel.init("./frontend")

fileLog = "data/dummy_log.csv"
fileModel = "data/base_model.pnml"

@eel.expose
def alignmentsToJson():
    aligns = pm.compute_trace_alignment(fileLog,fileModel)
    fullData = pm.compute_deviations(aligns)
    return json.dumps(fullData)

@eel.expose
def incidentsToJson():
    incidents = id.formatIncidents(fileLog)
    return json.dumps(incidents)
eel.start('index.html', mode='edge')