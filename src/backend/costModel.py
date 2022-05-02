# Params
from jinja2 import Undefined
from sympy import totient


dictAlfaMiss = {"aN":0.25,"aA":0.25,"aR":0.25,"aC":0.25}
Tmiss = 1 #1 per simple, 4 per enriched
dictAlfaMult = {"aN":0.25,"aA":0.25,"aW":0.2,"aR":0.2,"aC":0.1}
Tmult = 10
dictAlfaMismatch = {"aN":0.35,"aA":0.35,"aW":0.1,"aR":0.1,"aC":0.1}
Tmism = 4
dictAlfaCost = {"miss":0.33,"mult":0.34,"mism":0.33}

def calculateMissing(dfMiss):
    if int(dfMiss["N"])+int(dfMiss["A"])+int(dfMiss["R"])+int(dfMiss["C"]) > Tmiss:
        tot = 1
    else:
        tot = dictAlfaMiss["aN"]*dfMiss["N"]\
        +dictAlfaMiss["aA"]*dfMiss["A"]\
        +dictAlfaMiss["aR"]*dfMiss["R"]\
        +dictAlfaMiss["aC"]*dfMiss["C"]
    return tot

def calculateMultiple(dfMult, numEv):
    if int(dfMult["N"]) > Tmult or int(dfMult["A"]) > Tmult or int(dfMult["W"]) >Tmult or int(dfMult["R"])>Tmult or int(dfMult["C"])>Tmult:
        tot=1
    else:
        tot = dictAlfaMult["aN"]*(int(dfMult["N"])/numEv)\
        + dictAlfaMult["aA"]*(int(dfMult["A"])/numEv)\
        + dictAlfaMult["aW"]*(int(dfMult["W"])/numEv)\
        + dictAlfaMult["aR"]*(int(dfMult["R"])/numEv)\
        + dictAlfaMult["aC"]*(int(dfMult["C"])/numEv)
    return tot

def calculateMismatch(dfMism, numEv):
    if int(dfMism["N"]) + int(dfMism["A"]) + int(dfMism["W"]) + int(dfMism["R"]) + int(dfMism["C"]) > Tmism:
        tot=1
    else:
        tot = dictAlfaMismatch["aN"]*(int(dfMism["N"])/numEv)\
        + dictAlfaMismatch["aA"]*(int(dfMism["A"])/numEv)\
        + dictAlfaMismatch["aW"]*(int(dfMism["W"])/numEv)\
        + dictAlfaMismatch["aR"]*(int(dfMism["R"])/numEv)\
        + dictAlfaMismatch["aC"]*(int(dfMism["C"])/numEv)
    return tot

def calculateCost(cMiss, cRep, cMism):
    return dictAlfaCost["miss"]*cMiss+ dictAlfaCost["mult"]*cRep+ dictAlfaCost["mism"]*cMism