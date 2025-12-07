import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './Chat.css';

const Chat = ({ onBack }) => {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          <FaArrowLeft /> वापस जाएं
        </button>
        <h2>चैट - निलेश सीड्स</h2>
      </div>

      <div className="chat-placeholder">
        <h3>🚧 चैट फीचर जल्द आ रहा है</h3>
        <p>यह फीचर विकास में है। जल्द ही उपलब्ध होगा।</p>
        <p className="note">
          <strong>नोट:</strong> चैट फीचर में Firebase Realtime Database का उपयोग करके 
          रियल-टाइम मैसेजिंग होगी।
        </p>
      </div>
    </div>
  );
};

export default Chat;
