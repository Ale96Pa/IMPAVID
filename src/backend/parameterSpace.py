import csv
import itertools
import costModel as cm
import procMining as pm
import utilsPM as upm
import devDetection as dd

Tmiss = 1
Tmult = 10
Tmism = 4

"""
Write in a csv file incident processes to parametrize
"""
fileLog = "data/dummy_log.csv"
fileModel = "data/base_model.pnml"
csv_columns = ["incident_id", "alignment", "numEvent"]
csv_file = "data/dummyTraces.csv"
def writeAlignmentsOnFile():
    listElems = []
    aligns = pm.compute_trace_alignment(fileLog,fileModel)
    for e in aligns:
        trace = upm.convertTraceList(e["alignment"])
        numEvents = upm.countEvents(trace)
        newE = {"incident_id": e["incident_id"], "alignment": e["alignment"], "numEvent": numEvents}
        listElems.append(newE)
    try:
        with open(csv_file, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            for data in listElems:
                writer.writerow(data)
    except IOError:
        print("I/O error")


def permutation():
    listWeights = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    with open('data/weights.csv','w', newline='') as out:
        csv_out=csv.writer(out)
        for perm in itertools.product(listWeights, repeat = len(listWeights)-1):
            totW = sum(list(perm))
            if totW == 1:
                csv_out.writerow(perm)

def foo():
    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)
        traces = list(reader)
        for elem in traces:
            trace = upm.convertTraceList(elem["alignment"])
            resMissing = dd.detectMissing(trace)
            resRepetition = dd.detectMutliple(trace)
            resMismatch = dd.detectMismatch(trace)
            print(resMissing, resRepetition, resMismatch)

if __name__ == "__main__":
    # writeAlignmentsOnFile()
    permutation()