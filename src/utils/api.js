import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  // baseURL: 'http://ec2-13-61-22-147.eu-north-1.compute.amazonaws.com:5000',
  // baseURL: 'https://trekbiz.duckdns.org',
  headers: {
    'Content-Type': 'application/json',
  },
});




export default api;
