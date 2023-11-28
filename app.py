from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from ptyprocess import PtyProcess

app = Flask(__name__)
socketio = SocketIO(app)

# Initialize a global PtyProcess instance
pty_proc = None

@app.route('/')
def index():
    return render_template('index.html')

def create_terminal():
    global pty_proc
    pty_proc = PtyProcess.spawn(['/bin/bash'], dimensions=(80, 24))

def execute_command(command):
    global pty_proc
    pty_proc.write(command)
    output = pty_proc.read().decode('utf-8')
    output.split()
    print(output)
    return output

@socketio.on('input')
def handle_input(data):
    global pty_proc

    if pty_proc is None:
        create_terminal()

    try:
        output = execute_command(data)
        emit('output', {'output': output, 'prompt': get_prompt()})
    except Exception as e:
        emit('output', {'output': f"Error: {str(e)}", 'prompt': get_prompt()})



def get_prompt():
    global pty_proc
    if pty_proc is None:
        return "$ "  # Default prompt if terminal not created yet

    pty_proc.write(b'\n')
    
    prompt_bytes = b''
    while True:
        char = pty_proc.read(1)
        prompt_bytes += char
        if char == b'\n':
            break

    return prompt_bytes.decode('utf-8').strip()

if __name__ == '__main__':
    try:
        socketio.run(app, debug=True)
    finally:
        # Close the PtyProcess when the application is stopped
        if pty_proc is not None:
            pty_proc.terminate(force=True)
