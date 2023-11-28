var socket = io.connect('http://' + document.domain + ':' + location.port);
var term = new Terminal();
var fitAddon = new FitAddon.FitAddon();

term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();

term.prompt = (prompt) => {
    term.write(`\r\n${prompt} `);
};

term.writeln('remotepi v0.1.0-POC.3');
term.prompt();

let currentInput = '';

term.onKey(e => {
    const printable = !e.altKey && !e.altGraphKey && !e.ctrlKey && !e.metaKey;

    if (e.domEvent.keyCode === 13) {
        // Enter key
        const inputBytes = new TextEncoder().encode(currentInput);
        socket.emit('input', inputBytes);
        currentInput = '';  // Clear the current input for the next command
    } else if (e.domEvent.keyCode === 8) {
        // Backspace key
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            term.write('\b \b');
        }
    } else if (printable) {
        currentInput += e.key;
        term.write(e.key);
    }
});

socket.on('output', function (data) {
    // Split the output into lines
    const lines = data.output.split('\n');

    // Write each line to the terminal
    lines.forEach((line, index) => {
        term.writeln('\r' + line);
    });
});