const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// YAHA APNA SECRET PASSWORD SET KIJIYE (Aap ise badal bhi sakte hain)
const SECRET_PASSWORD = "sauravchat123";

let chatHistory = [];

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === SECRET_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Wrong Password! Access Denied." });
    }
});

io.on('connection', (socket) => {
    socket.emit('load history', chatHistory);

    socket.on('chat message', (msg) => {
        const messageData = {
            text: msg.text,
            sender: msg.sender,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        chatHistory.push(messageData);
        if(chatHistory.length > 200) chatHistory.shift();
        io.emit('chat message', messageData);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
