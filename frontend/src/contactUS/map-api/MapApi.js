import axios from 'axios';

const MAP_API_URL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/';
const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox access token

export const fetchMapData = async (longitude, latitude) => {
  try {
    const response = await axios.get(`${MAP_API_URL}${longitude},${latitude},14,0,0/600x400?access_token=${MAPBOX_ACCESS_TOKEN}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching map data:', error);
    throw error;
  }
};