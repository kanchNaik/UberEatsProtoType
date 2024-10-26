import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message'; // Import your Message component

class MessageService {
  constructor() {
    this.messageContainer = null;
  }

  // Initialize the message container once, if not already done
  init() {
    if (!this.messageContainer) {
      this.messageContainer = document.createElement('div');
      document.body.appendChild(this.messageContainer);
    }
  }

  // Method to show message
  showMessage(type, text) {
    this.init();

    // Use ReactDOM to render the Message component into the container
    ReactDOM.render(
      <Message type={type} text={text} onClose={() => this.clearMessage()} />,
      this.messageContainer
    );

    // Automatically clear the message after 3 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  // Clear the message and unmount the component
  clearMessage() {
    if (this.messageContainer) {
      ReactDOM.unmountComponentAtNode(this.messageContainer);
    }
  }
}

// Export a singleton instance of MessageService
export const messageService = new MessageService();
