/*
* grunt-browsersnapsy
* https://github.com/tdeekens/grunt-browsersnapsy
*
* Copyright (c) 2014 tdeekens
* Licensed under the MIT license.
*/

'use strict';

var curl = require('curlrequest'),
    wget = require('wgetjs'),
    BrowserStackTunnel = require('browserstacktunnel-wrapper');

module.exports = function(grunt) {
  grunt.registerMultiTask('browsersnapsy', 'Take screenshots via BrowserStack.', function() {
    var
      options = this.options({
        downloadTo: '',
        tunnel: false,
        browserstack: {},
        waitTime: 0,
        statusDelay: 10,
        abort: 50,
        user: '',
        token: ''
      }),
      apiRoot = 'http://www.browserstack.com/screenshots',
      initializeTunnel,
      closeTunnel,
      tunnel,
      requestScreenshots,
      requestStatus,
      downloadScreenshot,
      taskStatus = {
        ready: {},
        quantity: 0,
        processed: 0,
        done: 0,
        tries: 0
      },
      pingStatus,
      endTask = this.async();

    var
      request = curl.request({
        url: apiRoot,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        user: options.user + ':' + options.token,
        verbose: true,
        stderr: true
      });

    initializeTunnel = function(finished) {
      var isTunnelRequested = (
        typeof options.tunnel === 'object' &&
        options.tunnel.key &&
        options.tunnel.hosts.length > 0
      );

      if (!isTunnelRequested) {
        finished();
        return false;
      }

      tunnel = new BrowserStackTunnel(options.tunnel);

      tunnel.start(function(error) {
        if (error) {
          grunt.log.errorlns('Could not create tunnel(s) due to: ' + error + '.');
          closeTunnel();
          endTask();
        } else {
          grunt.log.ok('Successfully created tunnel(s)!');
          finished();
        }
      });
    };

    closeTunnel = function() {
      if (tunnel !== undefined) {
        tunnel.stop(function(error) {
          if (error) {
            grunt.log.errorlns('Could not close tunnel(s) due to: ' + error + '.');
          } else {
            grunt.log.ok('Successfully closed tunnel(s)!');
          }
        });
      }
    };

    requestScreenshots = function(success) {
      if (options.browserstack.dry_run === true) { success(); }

      request({
        data: JSON.stringify(options.browserstack)
      }, function(err, data) {
        if (err) {
          grunt.log.error('Screenshots requested failed.');
          closeTunnel();
          endTask();
        }

        grunt.log.subhead('Requesting screenshots finished.');

        success(data);
      });
    };

    requestStatus = function(screenshots, success, delay, log) {
      setTimeout(function() {
        var jobId = screenshots.job_id || screenshots.id;

        request({
          url: apiRoot + '/' + jobId
        }, function(err, data) {
          if (err) {
            grunt.log.error('Can not fetch screenshots\' taskStatus.');
            closeTunnel();
            endTask();
          }

          if (log !== false) {
            var response = JSON.parse(data),
                devices = response.screenshots.map(function(screenshot) {
                  var device = screenshot.device || screenshot.os + '' + screenshot.browser + screenshot.browser_version;
                  var orientation = screenshot.orientation || 'portrait';

                  return device + ' (' + orientation + ')';
                });

            grunt.log.ok(
              'Requests successfully made for: ' + devices + '.'
            );
          }

          success(data);
        });
      }, delay || options.waitTime * 1000);
    };

    pingStatus = function(request, log) {
      if (taskStatus.tries >= options.abort) {
        grunt.log.errorlns('Aborting, tried ' + options.abort + ' times to get screenshots.');
        closeTunnel();
        endTask();
      }

      if (log !== false) {
        grunt.log.ok(
          'Pinging status of screenshot requests ' +
          '(every ' + options.statusDelay + ' secs).'
        );
      } else {
        grunt.log.write('...');
      }

      request.screenshots.forEach(function(screenshot) {
        if (taskStatus.ready[screenshot.id] === undefined && screenshot.state === 'done') {
          taskStatus.processed++;
          downloadScreenshot(screenshot);
        }
      });

      if (taskStatus.processed !== taskStatus.quantity) {
        setTimeout(function() {
          requestStatus(request, function(data) {
            taskStatus.tries++;
            pingStatus(JSON.parse(data), false);
          }, 0, false);
        }, options.statusDelay * 1000);
      }
    };

    downloadScreenshot = function(screenshot) {
      if (taskStatus.ready[screenshot.id] !== undefined) {
        return false;
      }

      taskStatus.ready[screenshot.id] = screenshot;

      grunt.log.subhead(
        'Status of screenshots changed: ' +
        taskStatus.processed + ' of ' +
        taskStatus.quantity +
        ' ready (' +
        screenshot.device +
        ').'
      );

      wget({
        url: screenshot.image_url,
        dest: options.downloadTo
      }, function() {
        taskStatus.done++;

        if (taskStatus.done === taskStatus.quantity) {
          grunt.log.ok('All screenshots downloaded!');
          closeTunnel();
          endTask();
        }
      });
    };

    initializeTunnel(function() {
      requestScreenshots(function(data) {
        try {
          var screenshotRequest = JSON.parse(data);
        } catch (exception) {
          grunt.log.errorlns(data);
          closeTunnel();
          endTask();
          return false;
        }

        if (screenshotRequest.errors || screenshotRequest.message) {
          grunt.log.errorlns('BrowserStack request failed due to: ' +  screenshotRequest.message || screenshotRequest.errors);
          closeTunnel();
          endTask();
          return false;
        }

        taskStatus.quantity = screenshotRequest.screenshots.length;

        requestStatus(screenshotRequest, function(data) {
          var request = JSON.parse(data);

          pingStatus(request);
        });
      });
    });
  });
};
