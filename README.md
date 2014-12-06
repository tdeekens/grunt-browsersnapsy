# grunt-browsersnapsy

**NOTE: This project is under current development and not available via npm yet!**

> Grunt task for taking screenshots via the [BrowserStack](http://browserstack.com) screenshot API.

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
  downloadTo: '<path to where screenshots should be saved>'
}
```

The `browserstack` option object will be passed as the JSON-body in the request to BrowserStack. It can contain anything as specified in the [docs](http://www.browserstack.com/screenshots/api). You might check the example [here](https://github.com/tdeekens/grunt-browsersnapsy/blob/master/grunt/tasks/browsersnapsy.js)

## Release History
0.0.1 First release - proof of concept
