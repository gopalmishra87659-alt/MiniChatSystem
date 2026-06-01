from flask import Flask, render_template, request, jsonify
from datetime import datetime
import threading

app = Flask(__name__)

# In-memory chat state
lock = threading.Lock()
messages = []
users = {}  # session_id -> username
msg_counter = [0]

def get_timestamp():
    return datetime.now().strftime("%H:%M")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/join", methods=["POST"])
def join():
    data = request.get_json()
    username = data.get("username", "").strip()
    session_id = data.get("session_id", "")
    if not username or len(username) > 20:
        return jsonify({"error": "Invalid username"}), 400
    with lock:
        users[session_id] = username
        msg_counter[0] += 1
        messages.append({
            "id": msg_counter[0],
            "type": "system",
            "text": f"{username} joined the chat",
            "timestamp": get_timestamp()
        })
    return jsonify({"ok": True, "online": len(users)})

@app.route("/api/leave", methods=["POST"])
def leave():
    data = request.get_json()
    session_id = data.get("session_id", "")
    with lock:
        username = users.pop(session_id, None)
        if username:
            msg_counter[0] += 1
            messages.append({
                "id": msg_counter[0],
                "type": "system",
                "text": f"{username} left the chat",
                "timestamp": get_timestamp()
            })
    return jsonify({"ok": True})

@app.route("/api/send", methods=["POST"])
def send():
    data = request.get_json()
    session_id = data.get("session_id", "")
    text = data.get("text", "").strip()
    with lock:
        username = users.get(session_id)
        if not username:
            return jsonify({"error": "Not in chat"}), 403
        if not text or len(text) > 500:
            return jsonify({"error": "Invalid message"}), 400
        msg_counter[0] += 1
        messages.append({
            "id": msg_counter[0],
            "type": "user",
            "username": username,
            "text": text,
            "timestamp": get_timestamp()
        })
    return jsonify({"ok": True})

@app.route("/api/messages")
def get_messages():
    after = int(request.args.get("after", 0))
    with lock:
        new_msgs = [m for m in messages if m["id"] > after]
        online = len(users)
    return jsonify({"messages": new_msgs, "online": online})

@app.route("/api/clear", methods=["POST"])
def clear():
    with lock:
        messages.clear()
        msg_counter[0] = 0
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True, port=5000)