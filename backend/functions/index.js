const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { getDistance } = require('geolib');

admin.initializeApp();
const db = admin.firestore();
const rtdb = admin.database();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Shop location (Nilesh Seeds)
const SHOP_LOCATION = {
  latitude: parseFloat(process.env.SHOP_LATITUDE || 19.8762),
  longitude: parseFloat(process.env.SHOP_LONGITUDE || 75.3433)
};

const PROXIMITY_THRESHOLD = parseInt(process.env.PROXIMITY_THRESHOLD || 100);

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (role === 'admin') {
      // Admin login validation (hardcoded credentials)
      if (username === 'Nilesh Seeds' && password === '1008') {
        const adminQuery = await db.collection('users').where('role', '==', 'admin').limit(1).get();
        
        if (adminQuery.empty) {
          // Create admin user if doesn't exist
          const adminRef = await db.collection('users').add({
            username: 'Nilesh Seeds',
            name: 'Nilesh Seeds',
            role: 'admin',
            phone: '1008',
            profilePhotoUrl: '',
            village: '',
            address: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          return res.json({ 
            success: true, 
            userId: adminRef.id, 
            role: 'admin',
            name: 'Nilesh Seeds',
            username: 'Nilesh Seeds'
          });
        }
        
        const adminData = adminQuery.docs[0];
        return res.json({ 
          success: true, 
          userId: adminData.id, 
          role: 'admin',
          ...adminData.data()
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
    } else {
      // Farmer login (username = name, password = phone)
      const farmerQuery = await db.collection('users')
        .where('name', '==', username)
        .where('phone', '==', password)
        .where('role', '==', 'farmer')
        .limit(1)
        .get();

      if (farmerQuery.empty) {
        return res.status(401).json({ success: false, message: 'Invalid farmer credentials' });
      }

      const farmerData = farmerQuery.docs[0];
      return res.json({ 
        success: true, 
        userId: farmerData.id, 
        role: 'farmer',
        ...farmerData.data()
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, village, phone, address } = req.body;

    // Check if phone already exists
    const existingUser = await db.collection('users')
      .where('phone', '==', phone)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    // Create new farmer
    const farmerRef = await db.collection('users').add({
      name,
      username: name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
      village,
      phone,
      address,
      role: 'farmer',
      ledgerLink: '',
      profilePhotoUrl: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      userId: farmerRef.id,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/check-username', async (req, res) => {
  try {
    const { username, currentUserId } = req.body;

    const usersWithUsername = await db.collection('users')
      .where('username', '==', username)
      .get();

    const isAvailable = usersWithUsername.empty || 
      (usersWithUsername.size === 1 && usersWithUsername.docs[0].id === currentUserId);

    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// LOCATION TRACKING ENDPOINTS
// ============================================

app.post('/api/location/update', async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    // Update location in Realtime Database
    await rtdb.ref(`locations/${userId}`).set({
      latitude,
      longitude,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    // Check proximity to shop
    const distance = getDistance(
      { latitude, longitude },
      SHOP_LOCATION
    );

    if (distance <= PROXIMITY_THRESHOLD) {
      // Send proximity notification to admin
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      // Get admin user
      const adminQuery = await db.collection('users').where('role', '==', 'admin').limit(1).get();
      if (!adminQuery.empty) {
        const adminId = adminQuery.docs[0].id;

        await db.collection('notifications').add({
          type: 'proximity',
          userId: adminId,
          farmerId: userId,
          farmerName: userData.name,
          distance: distance,
          message: `${userData.name} is ${distance}m away from your shop`,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    res.json({ success: true, distance });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/location/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const locationSnapshot = await rtdb.ref(`locations/${userId}`).once('value');
    const location = locationSnapshot.val();

    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/locations/all', async (req, res) => {
  try {
    const locationsSnapshot = await rtdb.ref('locations').once('value');
    const locations = locationsSnapshot.val() || {};

    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

app.get('/api/users/farmers', async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = db.collection('users').where('role', '==', 'farmer');
    
    const farmersSnapshot = await query.orderBy('createdAt', 'desc').get();

    let farmers = farmersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side search filter
    if (search) {
      const searchLower = search.toLowerCase();
      farmers = farmers.filter(farmer => 
        farmer.name.toLowerCase().includes(searchLower) ||
        farmer.village.toLowerCase().includes(searchLower) ||
        farmer.phone.includes(search)
      );
    }

    res.json({ success: true, farmers });
  } catch (error) {
    console.error('Fetch farmers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: { id: userDoc.id, ...userDoc.data() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.role;
    delete updateData.createdAt;

    await db.collection('users').doc(userId).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:userId/ledger', async (req, res) => {
  try {
    const { userId } = req.params;
    const { ledgerLink } = req.body;

    await db.collection('users').doc(userId).update({
      ledgerLink,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: 'Ledger link updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// NOTIFICATIONS ENDPOINTS
// ============================================

app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await db.collection('notifications').doc(notificationId).update({
      read: true
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/notifications/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    await db.collection('notifications').doc(notificationId).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CHAT ENDPOINTS
// ============================================

app.get('/api/chat/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all chat rooms for this user
    const chatsSnapshot = await rtdb.ref('chats').once('value');
    const chats = chatsSnapshot.val() || {};
    
    let unreadCount = 0;
    const unreadChats = {};

    for (const chatId in chats) {
      if (chatId.includes(userId)) {
        const messages = chats[chatId].messages || {};
        let chatUnread = 0;
        
        for (const msgId in messages) {
          const msg = messages[msgId];
          if (msg.senderId !== userId && !msg.read) {
            chatUnread++;
          }
        }
        
        if (chatUnread > 0) {
          unreadChats[chatId] = chatUnread;
          unreadCount += chatUnread;
        }
      }
    }

    res.json({ success: true, unreadCount, unreadChats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);

// ============================================
// REALTIME DATABASE TRIGGERS
// ============================================

// Listen for new chat messages
exports.onNewMessage = functions.database.ref('/chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    try {
      const message = snapshot.val();
      const { chatId } = context.params;

      // Extract recipient ID from chatId
      const userIds = chatId.split('_');
      const recipientId = userIds.find(id => id !== message.senderId);

      if (recipientId) {
        // Get sender info
        const senderDoc = await db.collection('users').doc(message.senderId).get();
        const senderData = senderDoc.data();

        // Create notification for recipient
        await db.collection('notifications').add({
          type: 'message',
          userId: recipientId,
          chatId,
          senderId: message.senderId,
          senderName: senderData.name,
          message: message.text,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Message notification error:', error);
    }
  });
