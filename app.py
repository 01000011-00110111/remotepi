import fcntl
import os
import select
import subprocess
from flask import Flask, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

p = subprocess.Popen(['/bin/bash'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('command')
def execute_command(command):
    result = execute(command)
    socketio.emit('result', result)

def execute(command):
    try:
        p.stdin.write(command + '\n')
        p.stdin.flush()
        result = terminal_out()
        return result
    except subprocess.CalledProcessError as e:
        return f"Error: {e.output}"
    
def terminal_out():
    while True:
        rlist, _, _ = select.select([p.stdout, p.stderr], [], [], 0.1)
        if not rlist:
            break
            
        for stream in rlist:
            output = os.read(stream.fileno(), 4096).decode('utf-8')
        return [line.rstrip() for line in output.split('\n') if line.rstrip()]

if __name__ == '__main__':
    socketio.run(app, debug=True)