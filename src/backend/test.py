import eel
eel.init("./frontend")

@eel.expose
def say_hello_py(x):
    print('Hello from py to: ' + x)
    return 'Hello from py to: ' + x

eel.start('index.html', mode='edge')
