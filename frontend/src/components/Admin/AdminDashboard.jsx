import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Shared/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>नमस्ते, {user.name}!</h1>
          <p className="welcome-text">Admin Dashboard</p>
        </div>

        <div className="admin-placeholder">
          <h3>🚧 Admin Dashboard जल्द आ रहा है</h3>
          <p>यह फीचर विकास में है। जल्द ही उपलब्ध होगा।</p>
          
          <div className="features-list">
            <h4>आने वाले फीचर्स:</h4>
            <ul>
              <li>✅ किसान सूची और खोज</li>
              <li>✅ रियल-टाइम लोकेशन ट्रैकिंग</li>
              <li>✅ लेजर लिंक असाइनमेंट</li>
              <li>✅ चैट और कॉल फीचर्स</li>
              <li>✅ प्रोक्सिमिटी अलर्ट्स</li>
              <li>✅ किसान प्रोफाइल मैनेजमेंट</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
