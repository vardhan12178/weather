import axios from 'axios';

const getTimeAtLocation = async (lat, lon, apiKey) => {
  try {
    const response = await axios.get(`https://api.timezonedb.com/v2.1/get-time-zone`, {
      params: {
        key: apiKey,
        format: 'json',
        by: 'position',
        lat,
        lng: lon,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching time zone data:', error);
    return null;
  }
};

export default getTimeAtLocation;
