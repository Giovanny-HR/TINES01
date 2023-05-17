const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');

const mqtt = require('mqtt')

// Event listener for when the form is submitted
chatForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from submitting

  const message = messageInput.value; // Get the message from the input field
  if (message.trim() === '') return; // Do nothing if the message is empty or only whitespace

  appendMessage('You', message); // Display the message in the chat box

  messageInput.value = ''; // Clear the input field
});

// Function to append a message to the chat box
function appendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<span class="sender">${sender}:</span> ${message}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of the chat box
}
