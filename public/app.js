const socket = io();

let USERNAME = "";
let ROOM = "";
let PHONE_URL = "";

const joinBox = document.getElementById("joinBox");
const chatBox = document.getElementById("chatBox");

const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const joinBtn = document.getElementById("joinBtn");

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

const roomTitle = document.getElementById("roomTitle");
const meTitle = document.getElementById("meTitle");
const usersList = document.getElementById("usersList");

const fileInput = document.getElementById("fileInput");

const phoneLink = document.getElementById("phoneLink");
const copyBtn = document.getElementById("copyBtn");

// ✅ fetch server IP and show correct phone link
async function showPhoneLink() {
  try {
    const res = await fetch("/serverinfo");
    const data = await res.json();

    const port = window.location.port || "4000";
    PHONE_URL = `http://${data.ip}:${port}`;

    phoneLink.innerText = PHONE_URL;
  } catch (err) {
    phoneLink.innerText = "Could not load IP (check server)";
  }
}

showPhoneLink();

// ✅ copy button
copyBtn.addEventListener("click", async () => {
  if (!PHONE_URL) return;
  try {
    await navigator.clipboard.writeText(PHONE_URL);
    copyBtn.innerText = "Copied ✅";
    setTimeout(() => (copyBtn.innerText = "Copy Link"), 1200);
  } catch {
    alert("Copy failed, please copy manually:\n" + PHONE_URL);
  }
});

// join
joinBtn.addEventListener("click", () => {
  USERNAME = usernameInput.value.trim();
  ROOM = roomInput.value.trim() || "public";

  if (!USERNAME) return alert("Enter username!");

  socket.emit("join", { username: USERNAME, room: ROOM });

  joinBox.classList.add("hidden");
  chatBox.classList.remove("hidden");

  roomTitle.innerText = `Room: ${ROOM}`;
  meTitle.innerText = ` | You: ${USERNAME}`;

  msgInput.focus();
});

// send msg
function sendMessage() {
  const msg = msgInput.value.trim();
  if (!msg) return;

  socket.emit("chat", { room: ROOM, username: USERNAME, msg });
  msgInput.value = "";
  msgInput.focus();
}

sendBtn.addEventListener("click", sendMessage);

// Enter to send
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// emojis
document.querySelectorAll(".emoji").forEach(btn => {
  btn.addEventListener("click", () => {
    msgInput.value += btn.dataset.e;
    msgInput.focus();
  });
});

// file upload
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/upload", { method: "POST", body: formData });
  const data = await res.json();

  if (data.ok) {
    socket.emit("file", {
      room: ROOM,
      username: USERNAME,
      url: data.url,
      originalname: data.originalname
    });
  }

  fileInput.value = "";
});

// render helper
function addMessage(html, isMe = false) {
  const div = document.createElement("div");
  div.className = "msg" + (isMe ? " me" : "");
  div.innerHTML = html;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// receive chat
socket.on("chat", (data) => {
  const isMe = data.username === USERNAME;

  addMessage(`
    <div class="meta">${escapeHtml(data.username)} • ${escapeHtml(data.time)}</div>
    <div>${escapeHtml(data.msg)}</div>
  `, isMe);
});

// receive file
socket.on("file", (data) => {
  const isMe = data.username === USERNAME;
  const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(data.url);

  addMessage(`
    <div class="meta">${escapeHtml(data.username)} • ${escapeHtml(data.time)}</div>
    <div>
      📎 <a href="${data.url}" target="_blank">${escapeHtml(data.originalname)}</a>
    </div>
    ${isImage ? `<img src="${data.url}" style="width:100%; margin-top:8px; border-radius:12px;">` : ""}
  `, isMe);
});

// system msg
socket.on("system", (data) => {
  addMessage(`<div class="meta">⚡ ${escapeHtml(data.msg)}</div>`);
});

// user list
socket.on("users", (users) => {
  usersList.innerText = users.join(", ") || "-";
});

// escape html
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}
