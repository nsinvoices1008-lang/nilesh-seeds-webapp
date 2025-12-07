import { locationAPI } from './api';

export const startLocationTracking = (userId, onLocationUpdate) => {
  if (!navigator.geolocation) {
    console.error('Geolocation not supported');
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await locationAPI.update(userId, latitude, longitude);

        if (onLocationUpdate) {
          onLocationUpdate({ 
            latitude, 
            longitude, 
            distance: response.data.distance 
          });
        }
      } catch (error) {
        console.error('Location update error:', error);
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    }
  );

  return watchId;
};

export const stopLocationTracking = (watchId) => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true }
    );
  });
};

export const requestLocationPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    
    if (result.state === 'granted') {
      return true;
    } else if (result.state === 'prompt') {
      // Will prompt user when getCurrentLocation is called
      const location = await getCurrentLocation();
      return !!location;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};
