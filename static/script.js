// ── State ─────────────────────────────────────────
const state = {
  sessionId: crypto.randomUUID(),
  username: null,
  lastMsgId: 0,
  pollInterval: null,
};

// ── Helpers ───────────────────────────────────────
const $ = id => document.getElementById(id);
const joinScreen  = $("join-screen");
const chatScreen  = $("chat-screen");
const msgsList    = $("messages-list");
const onlineCount = $("online-count");

function showScreen(name) {
  joinScreen.classList.toggle("active", name === "join");
  chatScreen.classList.toggle("active", name === "chat");
}

async function api(path, body) {
  const res = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ── Render messages ───────────────────────────────
function renderMessages(newMsgs) {
  const atBottom = msgsList.parentElement.scrollHeight -
    msgsList.parentElement.scrollTop - msgsList.parentElement.clientHeight < 60;

  newMsgs.forEach(m => {
    if (m.type === "system") {
      const el = document.createElement("div");
      el.className = "msg-system";
      el.textContent = `⚡ ${m.text}`;
      msgsList.appendChild(el);
    } else {
      const isOwn = m.username === state.username;
      const wrap = document.createElement("div");
      wrap.className = `msg-wrap ${isOwn ? "own" : "other"}`;

      const meta = document.createElement("div");
      meta.className = "msg-meta";
      meta.innerHTML = `
        <span class="msg-num">[${m.id}]</span>
        <span class="msg-user">${escHtml(m.username)}</span>
        <span class="msg-time">${m.timestamp}</span>
      `;

      const bubble = document.createElement("div");
      bubble.className = "msg-bubble";
      bubble.textContent = m.text;

      wrap.appendChild(meta);
      wrap.appendChild(bubble);
      msgsList.appendChild(wrap);
    }
    state.lastMsgId = m.id;
  });

  if (atBottom || newMsgs.length > 0) {
    msgsList.parentElement.scrollTop = msgsList.parentElement.scrollHeight;
  }
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ── Poll for new messages ─────────────────────────
async function poll() {
  try {
    const data = await api(`/api/messages?after=${state.lastMsgId}`);
    onlineCount.textContent = data.online;
    if (data.messages.length) renderMessages(data.messages);
  } catch (e) { /* network blip, skip */ }
}

// ── Join ──────────────────────────────────────────
$("join-btn").addEventListener("click", joinChat);
$("username-input").addEventListener("keydown", e => e.key === "Enter" && joinChat());

async function joinChat() {
  const username = $("username-input").value.trim();
  const errEl = $("join-error");
  errEl.textContent = "";
  if (!username) { errEl.textContent = "Please enter a username."; return; }
  try {
    const data = await api("/api/join", { username, session_id: state.sessionId });
    if (data.error) { errEl.textContent = data.error; return; }
    state.username = username;
    state.lastMsgId = 0;
    msgsList.innerHTML = "";
    showScreen("chat");
    await poll();
    state.pollInterval = setInterval(poll, 1500);
    $("msg-input").focus();
  } catch (e) { errEl.textContent = "Could not connect. Is the server running?"; }
}

// ── Leave ─────────────────────────────────────────
$("leave-btn").addEventListener("click", leaveChat);

async function leaveChat() {
  clearInterval(state.pollInterval);
  await api("/api/leave", { session_id: state.sessionId }).catch(() => {});
  state.username = null;
  $("username-input").value = "";
  showScreen("join");
}

window.addEventListener("beforeunload", () => {
  navigator.sendBeacon("/api/leave", JSON.stringify({ session_id: state.sessionId }));
});

// ── Send ──────────────────────────────────────────
$("send-btn").addEventListener("click", sendMessage);
$("msg-input").addEventListener("keydown", e => e.key === "Enter" && sendMessage());

async function sendMessage() {
  const input = $("msg-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  await api("/api/send", { session_id: state.sessionId, text }).catch(() => {});
  await poll();
}

// ── Theme ─────────────────────────────────────────
$("theme-btn").addEventListener("click", () => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  $("theme-btn").textContent = isDark ? "☀️" : "🌙";
});

// ── Clear Chat ────────────────────────────────────
$("clear-btn").addEventListener("click", async () => {
  if (!confirm("Clear all messages?")) return;
  await api("/api/clear", {});
  msgsList.innerHTML = "";
  state.lastMsgId = 0;
});