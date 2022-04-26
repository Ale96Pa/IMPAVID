function test() {
    el = say_hello_py(10); // This calls the Python function that was decorated
    
    d3.select("body").append("span")
    .text("Hello, world!");

    d3.select("body").append("span")
    .text(el);

    eel.expose(say_hello_js)
    
    say_hello_js("Javascript World!");
    eel.say_hello_py("Javascript World!");
}