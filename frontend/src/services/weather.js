import axios from 'axios';

const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByLocation = async (latitude, longitude, lang = 'hi') => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: lang
      }
    });

    return {
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      windSpeed: response.data.wind.speed,
      city: response.data.name,
      pressure: response.data.main.pressure,
      visibility: response.data.visibility / 1000, // Convert to km
      sunrise: new Date(response.data.sys.sunrise * 1000),
      sunset: new Date(response.data.sys.sunset * 1000)
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

export const getWeatherForecast = async (latitude, longitude, lang = 'hi') => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: lang
      }
    });

    return response.data.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));
  } catch (error) {
    console.error('Weather forecast error:', error);
    throw error;
  }
};
