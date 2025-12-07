import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './VideoCall.css';

const VideoCall = ({ isVideoCall, onBack }) => {
  return (
    <div className="videocall-container">
      <div className="videocall-header">
        <button className="back-btn" onClick={onBack}>
          <FaArrowLeft /> वापस जाएं
        </button>
        <h2>{isVideoCall ? 'वीडियो कॉल' : 'वॉइस कॉल'} - निलेश सीड्स</h2>
      </div>

      <div className="videocall-placeholder">
        <h3>🚧 {isVideoCall ? 'वीडियो' : 'वॉइस'} कॉल फीचर जल्द आ रहा है</h3>
        <p>यह फीचर विकास में है। जल्द ही उपलब्ध होगा।</p>
        <p className="note">
          <strong>नोट:</strong> {isVideoCall ? 'वीडियो' : 'वॉइस'} कॉल फीचर में WebRTC 
          का उपयोग करके पीयर-टू-पीयर कॉलिंग होगी।
        </p>
      </div>
    </div>
  );
};

export default VideoCall;
