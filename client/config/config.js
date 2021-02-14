const LOCAL_HOST = 'http://localhost:3065';
const AWS_HOST = 'http://slack.api.shinywaterjeong.com'

const config = {
  "development": {
    'SERVER_URL': LOCAL_HOST,
  },
  "test": {
    'SERVER_URL': LOCAL_HOST,
  },
  "production": {
    'SERVER_URL': AWS_HOST,
  }
}

export default config