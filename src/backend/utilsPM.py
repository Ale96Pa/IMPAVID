"""
This function returns the only activity name from alignment format
@param activity="[S/M/L]activity_name"
"""
def extractActivtyName(activity):
    return activity.split("]")[1]

"""
This function converts the trace alignent from string to list
"""
def convertTraceList(traceString):
    return traceString.split(";")[:-1]