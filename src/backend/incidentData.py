import json
import csv

import eel
eel.init("./frontend")

fileLog = "data/dummy_log.csv"

"""
This function format data by incident ID
"""
def formatIncidents(inputFile):
    res = []
    with open(inputFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=';')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                print(row)
                # for i in range(0,len(row)):
                #     print(row[i]+"--"+str(i))
            else:
                res.append({"incident_id": row[0], "impact":row[20], "urgency":row[21], "priority":row[22], "category":row[16]})
            line_count+=1
    result = list({i['incident_id']:i for i in res}.values())
    return result

# @eel.expose
# def incidentsToJson():
#     incidents = formatIncidents(fileLog)
#     return json.dumps(incidents)
# eel.start('index.html', mode='edge')

# if "__main__"==__name__:
#     incidents = formatIncidents(fileLog)