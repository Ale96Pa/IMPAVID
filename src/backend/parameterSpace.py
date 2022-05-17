import csv
import itertools
import costModel as cm
import procMining as pm
import utilsPM as upm
import devDetection as dd

Tmiss = 2
Tmult = 15
Tmism = 5

"""
Write in a csv file incident processes to parametrize
"""
fileLog = "data/simple_log.csv"
fileModel = "data/simple_model.pnml"
csv_columns = ["incident_id", "alignment", "numEvent"]
csv_file = "data/simpleTraces.csv"
csv_weigths = "data/weightsLight.csv"

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
    # listWeights = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    listWeights = ["l","m","h"]
    errs=["miss","rep","mism"]
    all = []
    with open('data/weightsLight.csv','w', newline='') as out:
        csv_out=csv.writer(out)
        csv_out.writerow(errs)
        for perm in itertools.product(listWeights, repeat = len(errs)):
            # # totW = sum(list(perm))
            # # if totW == 1:
            # csv_out.writerow(perm)
            all.append(''.join(perm))
    
        # print(all)
        for comb in itertools.product(all, repeat = 3):
            # print(comb)
            csv_out.writerow(comb)


def computeParamCosts():
    with open(csv_file, "r") as f:
         with open(csv_weigths, "r") as w:
            with open('data/allCosts.csv','w', newline='') as out:
                csv_out=csv.writer(out)
                reader = csv.DictReader(f)
                traces = list(reader)

                readerErr = csv.DictReader(w)
                wErr = list(readerErr)

                for elem in traces:
                    trace = upm.convertTraceList(elem["alignment"])
                    resMissing = dd.detectMissing(trace)
                    resRepetition = dd.detectMutliple(trace)
                    resMismatch = dd.detectMismatch(trace)

                    numEvents = int(elem["numEvent"])
                    
                    for weight in wErr:
                        missW = list(weight["miss"])
                        repW = list(weight["rep"])
                        mismW = list(weight["mism"])

                        dictAlfaMiss = {
                        "N": convertStringToWeigth(missW[0]),
                        "A": convertStringToWeigth(missW[1]),
                        "W": convertStringToWeigth(missW[2]),
                        "R": convertStringToWeigth(missW[3]),
                        "C": convertStringToWeigth(missW[4])}

                        dictAlfaMult = {
                        "N": convertStringToWeigth(repW[0]),
                        "A": convertStringToWeigth(repW[1]),
                        "W": convertStringToWeigth(repW[2]),
                        "R": convertStringToWeigth(repW[3]),
                        "C": convertStringToWeigth(repW[4])}

                        dictAlfaMismatch = {
                        "N": convertStringToWeigth(mismW[0]),
                        "A": convertStringToWeigth(mismW[1]),
                        "W": convertStringToWeigth(mismW[2]),
                        "R": convertStringToWeigth(mismW[3]),
                        "C": convertStringToWeigth(mismW[4])}

                        costMissing = cm.calculateMissing(resMissing,dictAlfaMiss, Tmiss)
                        costRepetition = cm.calculateMultiple(upm.addAllActivities(resRepetition), numEvents, dictAlfaMult, Tmult)
                        costMismatch = cm.calculateMismatch(upm.addAllActivities(resMismatch), numEvents, dictAlfaMismatch, Tmism)
                        csv_out.writerow([weight["miss"],costMissing,weight["rep"],costRepetition,weight["mism"],costMismatch])

# dictAlfaMiss = {"N":0.2,"A":0.2, "W":0.2, "R":0.2,"C":0.2}
# threshold = {"low":0.37,"medium":0.69,"high":0.89}
def convertStringToWeigth(level):
    if(level == "l"):
        return 1
    elif level=="m":
        return 2
    else:
        return 4

if __name__ == "__main__":
    # permutation()
    # writeAlignmentsOnFile()
    computeParamCosts()