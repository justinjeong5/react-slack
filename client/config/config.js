const LOCAL_HOST = 'http://localhost:3065';

const config = {
  "development": {
    'SERVER_URL': LOCAL_HOST,
  },
  "test": {
    'SERVER_URL': LOCAL_HOST,
  },
  "production": {
    'SERVER_URL': LOCAL_HOST,
  }
}

export default config