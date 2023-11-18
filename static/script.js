const socket = io();

function sendCommand() {
    let command = document.getElementById("command")["value"];

    socket.emit('command', command);
}

function renderResult(value) {
    let list = document.getElementById("result");
    let listFixed = '';
    for (let text of value) {
        listFixed = `${listFixed}       ${text}<br>`
    }
    list["innerHTML"] = list["innerHTML"] + 'result: <br>' + listFixed
}

// socketio

socket.on("result", (result) => {
    renderResult(result);
});