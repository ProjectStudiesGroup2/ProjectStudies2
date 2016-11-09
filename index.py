from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.players = 1
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html', player=app.players)


@socketio.on('connect')
def on_connect():
    app.players += 1


@app.route('/<path:path>')
def static_file(path):
    return send_from_directory('templates', path)


@socketio.on('goalie')
def handle_message(msg):
    emit('goalie', msg, broadcast=True)


if __name__ == "__main__":
    socketio.run(app)
