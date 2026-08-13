# 📡 WiFi Chat App

A lightweight real-time messaging application that allows users connected to the **same WiFi network** to communicate instantly without internet access. This project uses **Node.js, Express, and Socket.io** to create a simple and fast local chat system between devices such as laptops and smartphones.

---

## 🚀 Features

* 💬 Real-time messaging using Socket.io
* 📶 Works on the same WiFi network (no internet required)
* 📱 Compatible with mobile browsers and computers
* ⚡ Fast communication with WebSockets
* 📂 Supports message sharing through a simple interface
* 🖥️ Easy server startup using `run.bat`

---

## 🛠️ Technologies Used

* **Node.js**
* **Express.js**
* **Socket.io**
* **HTML**
* **CSS**
* **JavaScript**

---

## 📂 Project Structure

`
wifi-chat-app
│
├── uploads/
├── public/
├── node_modules/
├── server.js
├── package.json
├── package-lock.json
├── run.bat
├── README.md
└── LICENSE
`
---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rsamwilson2323-cloud/wifi-chat-app.git
```

### 2️⃣ Navigate to the Project Folder

```bash
cd wifi-chat-app
```

### 3️⃣ Install Required Dependencies

```bash
npm install
```

---

## ▶️ Running the Application

### Option 1 – Using Command Line

```bash
node server.js
```

### Option 2 – Using the BAT file (Windows)

Double click:

```
run.bat
```

---

## 📱 Accessing the Chat from Your Phone

1. Connect your **phone and laptop to the same WiFi network or hotspot**

2. Find your laptop IP address:

```bash
ipconfig
```

Look for **IPv4 Address**

Example:

```
192.168.43.120
```

3. Open your phone browser and enter:

```
http://192.168.43.120:3000
```

Now you can chat between devices.

---

## 📸 Example Use Cases

* Classroom communication
* Office internal messaging
* LAN chat systems
* Local event messaging
* Offline messaging over WiFi

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Sam Wilson**

🔗 GitHub: https://github.com/rsamwilson2323-cloud
💼 LinkedIn: https://www.linkedin.com/in/sam-wilson-14b554385


---

⭐ If you found this project useful, consider giving it a **star** on GitHub!
