// eel.expose(say_hello_js); // Expose this function to Python
// function say_hello_js(x) {
//   console.log("Hello from " + x);
//   return "Hello from " + x;
// }

async function retrieveAlignment() {
    const alignments = await eel.alignmentsToJson()();
    d3.select("body").append("span").text(alignments);
}