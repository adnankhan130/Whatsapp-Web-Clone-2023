import React from 'react';
import './ChatMessage.css';
import { auth } from '../firebase';

const ChatMessage = ({ message, time, sender }) => {
  // Check if time is a Timestamp
  const timestamp = time.toDate ? time.toDate() : new Date(time);

  // Convert timestamp to JavaScript Date
  const messageDate = new Date(timestamp);
  const formattedDate = messageDate.toLocaleDateString();
  const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="chat-message"
      style={{
        alignSelf:
          sender === auth?.currentUser?.email ? 'flex-end' : 'flex-start',

        backgroundColor:
          sender == auth?.currentUser?.email ? '#dcf8c6' : '#fff',
      }}
    >
      <div className="chat-message-text">
        <p>{message}</p>
      </div>
      <div className="chat-message-date">
        <p>{formattedDate} {formattedTime}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
