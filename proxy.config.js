// const serverUrl = 'https://scoliologic-dev.simbirsoft';
const serverUrl = 'http://localhost:5001';
// const serverUrl = 'https://scoliologic-test.simbirsoft';
// const serverUrl = 'http://callback.simbirsoft1.com';
// const serverUrl = 'http://192.168.72.156:5001';


module.exports = {
  '/api': {
    target: serverUrl,
    secure: false,
    changeOrigin: true
  },
  '/signalr': {
    target: serverUrl,
    secure: false,
    changeOrigin: true,
    ws: true
  }
};
