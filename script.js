import { io } from './node_modules/socket.io-client/dist/socket.io.esm.min.js';

const messages = $("#messages");
const joinRoomBtn = $("#joinRoomBtn")
const messageBtn = $("#messageBtn");
const roomInput = $("#room");
const messageInput = $("#message");
const showRoomId = $("#showRoomId");

const socket = io('http://localhost:8000')

let socketId;
let room = '';

socket.on('connect', () => {
    socketId = socket.id;
    addMessage(`You connected with: ${socketId}`, 'server', '');
})

$(document).ready(function() {
    messageBtn.click(sendMessage);

    messageInput.keypress(function(e) {
        if (e.keyCode === 13) {
            sendMessage();
        }
    });

    joinRoomBtn.click(() => joinRoom());

    roomInput.keypress(function(e) {
        if (e.keyCode === 13) {
            joinRoom()
        }
    });
});

function sendMessage() {
    socket.emit('send-message', messageInput.val(), socket.id, room);
    addMessage(messageInput.val(), 'you', room);
}

socket.on('receive-message', (message, fromId, fromRoom) => {
    addMessage(message, fromId, fromRoom);
})

function addMessage(text, fromId, fromRoom) {
    let privateText = '';

    if (fromRoom !== '') {
        privateText = `(private room: ${fromRoom})`
    }

    const from = $("<p />", {
        class: "text-xs",
        text: `- ${fromId} ${privateText}`,
    })

    const message = $("<p />", {
        class: "even:bg-blue-500 even:text-white rounded-md p-2",
        text: text,
    })

    message.append(from);

    messages.append(message);

    messageInput.val("");
}

function joinRoom() {
    room = roomInput.val();
    showRoomId.text(room);
}