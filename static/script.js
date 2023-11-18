// Wrap the code in a window load event to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const socket = io();
    // Create xterm.js terminal and attach it to the "terminal" div
    const terminal = document.getElementById('terminal');
    const term = new Terminal();
    term.open(terminal);

    // socketio
    socket.on("result", (result) => {
        renderResult(result);
    });

    term.prompt = () => {
        term.write('\r\n$ ');
    };

    let curr_line = '';
    // Listen for user input
    term.onKey(e => {
        const key = e.domEvent.key;
        // const letter = e.domEvent.key[0];

        // console.log(key.charCodeAt(0))
        if (key === 'Enter') {// Enter key pressed, log curr_line, send to server and reset
            socket.emit('command', curr_line);
            curr_line = '';
        } else if (key === 'Backspace') {// delete when backspace is pressed
            console.log('pressed ' + curr_line.length)
            if (curr_line.length > 0) {
                curr_line = curr_line.slice(0, -1);
                term.write('\b \b');
            }
        } else {// display the current letters
            curr_line += key;
            term.write(key);
        }
    });

    function renderResult(value) {
        term.writeln('\nResult:');
        for (let text of value) {
            term.writeln(`   ${text}`);
        }
    }
});