/* globals module */
module.exports = {
  options: {
    user: '',
    token: '',
    downloadTo: './test/screenshots/latest/'
  },
  test: {
    options: {
      browserstack: {
        dry: true
      }
    }
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
        }, {
          os: 'ios',
          os_version: '8.0',
          browser_version: null,
          browser: 'Mobile Safari',
          device: 'iPad Mini 2'
        }, {
          os: 'android',
          os_version: '5.0',
          browser_version: null,
          browser: 'Android',
          device: 'Google Nexus 5'
        }, {
          os: 'ios',
          os_version: '8.0',
          browser_version: null,
          browser: 'Mobile Safari',
          device: 'iPad Air'
        }, {
          os: 'ios',
          os_version: '8.0',
          browser_version: null,
          browser: 'Mobile Safari',
          device: 'iPad Air',
          orientation: 'landscape'
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
