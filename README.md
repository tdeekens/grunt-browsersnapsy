# grunt-browsersnapsy

**NOTE: This project is under current development and not fully tested!**

> Grunt task for taking screenshots via the [BrowserStack](http://browserstack.com) screenshot API.

[![NPM](https://nodei.co/npm/grunt-browsersnapsy.png?mini=true)](https://nodei.co/npm/grunt-browsersnapsy/)

[![Build Status](https://travis-ci.org/tdeekens/grunt-browsersnapsy.svg?branch=master)](https://travis-ci.org/tdeekens/grunt-browsersnapsy)
[![Build Status](https://drone.io/github.com/tdeekens/grunt-browsersnapsy/status.png)](https://drone.io/github.com/tdeekens/grunt-browsersnapsy/latest)
[![Circle CI](https://circleci.com/gh/tdeekens/grunt-browsersnapsy/tree/master.svg?style=svg)](https://circleci.com/gh/tdeekens/grunt-browsersnapsy/tree/master)
[![Dependency Status](https://david-dm.org/tdeekens/grunt-shrinkwrapsy.svg?style=flat)](https://david-dm.org/tdeekens/grunt-shrinkwrapsy.svg?style=flat)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-browsersnapsy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-browsersnapsy');
```

## The "browsersnapsy" task

### Overview
In your project's Gruntfile, the `browsersnapsy` task is available to use.

You can run `grunt browsersnapsy` standalone
Or add it to an existing task: `grunt.registerTask('test', ['clean', 'browsersnapsy']);`

### Options

```javascript
options: {
  user: '<username>',
  token: '<access token>',
  downloadTo: '<path to where screenshots should be saved>',
  statusDelay: '<Delay between task polling BrowserStack for the screenshots\' status>',
  waitTime: '<Initial delay for request to be made>',
  abort: '<max number of pings for screenshot (* statusDelay)>',
  tunnel: '<passed to node-BrowserStackTunnel>'
}
```

The `browserstack` option object will be passed as the JSON-body in the request to BrowserStack. It can contain anything as specified in the [docs](http://www.browserstack.com/screenshots/api). You might check the example [here](https://github.com/tdeekens/grunt-browsersnapsy/blob/master/grunt/tasks/browsersnapsy.js). For local tunnled testing please refer to [node-BrowserStackTunnel](https://github.com/pghalliday/node-BrowserStackTunnel) and the local testing documentation at [BrowserStack](http://www.browserstack.com/local-testing#config-localhost).

## Developing & Contributing

Developing on the task alone is fairly easy just `git clone https://github.com/tdeekens/grunt-browsersnapsy.git` then `cd grunt-browsersnapsy`. From there one has to link the package to itself via `npm link && npm link grunt-browsersnapsy` which will allow for calling `grunt dev`. Now just work the `task/browsersnapsy.js` and check results - feel free to submit a pull-request!

## Release History
- 0.0.1 First release - proof of concept
- 0.0.2 Improved error handling with BrowserStack's API
- 0.0.3 Handle authentification errors with BrowserStack
- 0.0.4 Prettifies logging of status
- 0.0.5 Add immediate downloading of available screenshots
- 0.0.6 Add support for maximum amount of tries to fetch screenshots
- 0.1.0 Add support for local testing (tunneling)

## Roadmap
- Automatic image diffing against reference screenshots
