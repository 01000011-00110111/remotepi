const socket = io();

// Wrap the code in a window load event to ensure the DOM is fully loaded
window.onload = function() {
    // Create xterm.js terminal and attach it to the "terminal" div
    const term = new Terminal();
    term.open(document.getElementById('terminal'));

    // socketio
    socket.on("result", (result) => {
        renderResult(result);
    });

    function renderResult(value) {
        term.writeln('Result:');
        for (let text of value) {
            term.writeln(`   ${text}`);
        }
    }
};

function sendCommand() {
    let command = document.getElementById("command").value;
    socket.emit('command', command);
}