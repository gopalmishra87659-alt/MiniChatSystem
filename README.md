<<<<<<< HEAD
# 💬 Mini Chat Room

A real-time multi-user chat application built with **Python Flask**, **HTML**, **CSS**, and **JavaScript** — no WebSockets required.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 👤 **Username login** — choose your display name before joining
- 🚪 **Join / Leave** — enter and exit the chat room at any time
- 💬 **Send messages** — real-time polling (1.5s) keeps chat updated
- 📜 **Chat history** — all messages shown with sequential numbering `[1]`, `[2]`, ...
- 🕐 **Timestamps** — every message shows the time it was sent
- 👥 **Online user count** — live count of active users in the header
- 🔔 **Join/Leave notifications** — system messages when users enter or leave
- 🌙 **Dark / Light mode** — toggle with one click
- 🗑️ **Clear chat** — wipe the message history (confirmation required)
- 📱 **Responsive UI** — works on desktop and mobile

---

## 🗂️ Project Structure

```
chat-room-app/
├── app.py               # Flask backend (routes, in-memory state)
├── requirements.txt     # Python dependencies
├── README.md
├── templates/
│   └── index.html       # Single-page HTML
├── static/
│   ├── style.css        # All styles (dark/light theme, responsive)
│   └── script.js        # Frontend logic (join, send, poll, theme)
└── screenshots/         # Add screenshots here for GitHub preview
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/chat-room-app.git
cd chat-room-app
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the server
```bash
python app.py
```

### 4. Open your browser
```
http://localhost:5000
```

Open in **multiple tabs or devices on the same network** to test real-time chat.

---

## 🖼️ Example UI

```
─────────────────────────────────
        Python Chat Room
─────────────────────────────────
Username: [ Gopal    ]
Message:  [ Hello    ] [Send]
─────────────────────────────────
Chat History
─────────────────────────────────
[1] Gopal   : Hello
[2] Alice   : Hi
[3] Bob     : Welcome
─────────────────────────────────
```

---

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Backend  | Python 3, Flask         |
| Frontend | HTML5, CSS3, JavaScript |
| Comms    | REST API + polling      |
| State    | In-memory (thread-safe) |

---

## 📌 Notes

- Messages are stored **in memory** — they reset when the server restarts.
- For persistent storage, swap the `messages` list with a SQLite database.
- For true real-time (no polling), consider adding Flask-SocketIO.

---

## 📄 License

MIT — free to use, modify, and distribute.
=======
# MiniChatSystem
A Simple Flask based chat application
>>>>>>> dfd3ff7ef8ba7d34435a3b7774809e07c803485f
