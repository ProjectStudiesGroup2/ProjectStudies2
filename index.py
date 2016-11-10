from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.nb_players = 1
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html', player=app.nb_players)


@app.route('/<path:path>')
def static_file(path):
    return send_from_directory('templates', path)


@socketio.on('connect')
def on_connect():
    app.nb_players += 1


@socketio.on('ball')
def handle_ball(msg):
    emit('ball', msg, broadcast=True)


@socketio.on('goalie')
def handle_goalie(msg):
    emit('goalie', msg, broadcast=True)


if __name__ == "__main__":
    socketio.run(app)
