eel.expose(say_hello_js); // Expose this function to Python
function say_hello_js(x) {
  console.log("Hello from " + x);
  return "Hello from " + x;
}

async function test() {
    const tt = await eel.say_hello_py("js")();
    d3.select("body").append("span").text(tt);
}