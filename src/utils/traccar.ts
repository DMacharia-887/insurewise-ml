// src/utils/traccar.ts
import axios from 'axios';

// Talk directly to the server instead of routing through Vite's proxy
// Ensure this matches your actual Traccar URL
const TRACCAR_BASE_URL = 'https://fleet.aptic.co.ke/api';

// Create a direct axios instance
const traccarApi = axios.create({
  baseURL: TRACCAR_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // Your base64 encoded credentials (info@apticcredit.com:Aptic@2025)
    'Authorization': 'Basic ' + btoa('info@apticcredit.com:Aptic@2025')
  }
});

export const fetchTraccarDrivers = async () => {
  try {
    const response = await traccarApi.get('/drivers');
    return response.data; 
  } catch (error) {
    console.error("Error fetching Traccar drivers:", error);
    throw error;
  }
};

export const fetchTraccarDevices = async () => {
  try {
    const response = await traccarApi.get('/devices');
    return response.data; 
  } catch (error) {
    console.error("Error fetching Traccar devices:", error);
    throw error;
  }
};

// Fetches the latest known position for all devices
export const fetchTraccarPositions = async () => {
  try {
    const response = await traccarApi.get('/positions');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Traccar positions:", error);
    return [];
  }
};

// Fetches daily summary (Average Speed, Engine Hours, etc.)
export const fetchTraccarDailySummary = async (deviceIds: number[]) => {
  try {
    if (!deviceIds || !deviceIds.length) return [];
    
    // Get start and end of the current day
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    
    const query = deviceIds.map(id => `deviceId=${id}`).join('&');
    const response = await traccarApi.get(`/reports/summary?${query}&from=${from.toISOString()}&to=${to.toISOString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return [];
  }
};

// Fetches all individual trips taken today (to calculate Night Driving)
export const fetchTraccarDailyTrips = async (deviceIds: number[]) => {
  try {
    if (!deviceIds || !deviceIds.length) return [];
    
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    
    const query = deviceIds.map(id => `deviceId=${id}`).join('&');
    const response = await traccarApi.get(`/reports/trips?${query}&from=${from.toISOString()}&to=${to.toISOString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return [];
  }
};
