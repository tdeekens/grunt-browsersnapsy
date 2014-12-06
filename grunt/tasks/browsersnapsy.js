/* globals module */
module.exports = {
  options: {
    user: '',
    token: '',
    downloadTo: './test/screenshots/latest/'
  },
  nba: {
    options: {
      browserstack: {
        url: 'http://nba.com',
        browsers: [{
          os: 'ios',
          os_version: '8.0',
          browser_version: null,
          browser: 'Mobile Safari',
          device: 'iPhone 6 Plus'
        }]
      }
    },
    google: {
      options: {
        browserstack: {
          url: 'http://google.com',
          browsers: [{
            os: 'Windows',
            os_version: '7',
            browser_version: '8.0',
            browser: 'ie'
          }]
        }
      }
    }
  },
};
