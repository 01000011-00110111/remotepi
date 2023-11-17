from flask import Flask, render_template, request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute_command():
    command = request.form['command']
    result = execute(command)
    return render_template('index.html', result=result)

def execute(command):
    try:
        result = subprocess.check_output(command, shell=True, text=True, stderr=subprocess.STDOUT)
        return result
    except subprocess.CalledProcessError as e:
        return f"Error: {e.output}"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')