const io = require('socket.io')(8000, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('send-message', (message, from, room) => {
        if (room === '') {
            socket.broadcast.emit('receive-message', message, from, room);
        } else {
            socket.to(room).emit('receive-message', message, from, room);
        }
    })
})

const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
    let ext = path.extname(filePath);

    // Set MIME types correctly
    let contentType = "text/html";
    if (ext === ".js") contentType = "application/javascript";
    if (ext === ".css") contentType = "text/css";

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
});

server.listen(8080, () => console.log("Server running at http://localhost:8080"));
