const host = "netwerkenbasis.com";
const port = "1884";

const studentNumber = "1021941"

var connected_flag = 0;

var authentication = prompt("Input <username>:<password>")

function authenticate() {
    if (authentication.includes(":")) {
        const split = authentication.split(":");
        const username = split[0];
        const password = split[1];

        startConnect(username, password);
    } else {
        confirm("invalid input")
        location.reload();
    }
}

function startConnect(username, password) {
    console.log("Function startConnect");

    userID = "userID - " + studentNumber;

    client = new Paho.MQTT.Client(host, Number(port), userID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        useSSL: true,
        timeout: 3,
        cleanSession: true,
        onSuccess: onConnect,
        onFailure: onFailure,
        userName: username,
        password: password
    });
}

function onConnect() {
    console.log("Function onConnect");

    client.subscribe("#");

    // document.getElementById("status").innerHTML = "Connected using <b>" + userID + "</b>";

    joinedMessage();

    connected_flag = 1;
    console.log("verbonden" + connected_flag)
}

function onFailure(message) {
    console.log("Connection failed");
}

function onConnectionLost(responseObject) {
    console.log("Function onConnectionLost");

    document.getElementById("status").innerHTML = "Connection Lost";

    connected_flag = 0;
}

function joinedMessage() {
    console.log("Function joinedMessage()");
    msg = userID + " joined the chat";

    message = new Paho.MQTT.Message(msg);
    message.destinationName = "chat/message";
    message.qos = 2;
    message.retained = false;

    client.send(message);

    // scrollBottom();
}

function onMessageArrived(message) {
    console.log("Function onMessageArrived()");

    console.log("OnMessageArrived: " + message.payloadString);
    console.log("saved berichtje: " + msg);

    if (message.payloadString === msg) {
        newMessageSend(message.payloadString);
    } else {
        newMessageReceived(message.payloadString)
    }
}

function newMessageSend(message) {
    const newDiv = document.createElement("div");
    newDiv.className = "send-container";

    const messageDiv = document.createElement("div");
    messageDiv.className = "send";

    const messageParagraph = document.createElement("p");
    messageParagraph.className = "message";
    messageParagraph.innerHTML = message;

    messageDiv.appendChild(messageParagraph);
    newDiv.appendChild(messageDiv);

    document.getElementById("chat-messages").insertBefore(newDiv, document.nextSibling);

    scrollBottom();
}

function newMessageReceived(message) {
    const newDiv = document.createElement("div");
    newDiv.className = "received-container";

    const messageDiv = document.createElement("div");
    messageDiv.className = "received";

    const messageParagraph = document.createElement("p");
    messageParagraph.className = "message";
    messageParagraph.innerHTML = message;

    messageDiv.appendChild(messageParagraph);
    newDiv.appendChild(messageDiv);

    document.getElementById("chat-form").insertBefore(newDiv, document.nextSibling);

    scrollBottom();
}

function sendMessage() {
    console.log("Function sendMessage");

    if (connected_flag == 0) {
        out_msg = "<b>Not Connected so can't send</b>";
        console.log(out_msg);
        return false;
    }

    msg = document.getElementById("message-input").value;

    if (msg.trim() == "") {
        return;
    }

    message = new Paho.MQTT.Message(msg);
    message.destinationName = "chat/message";
    message.qos = 2;
    message.retained = false;

    client.send(message);

    document.getElementById("message-input").value = "";
}

function scrollBottom() {
    chatdiv = document.getElementById("chat-form");
    chatdiv.scrollTop = chatdiv.scrollHeight;
}