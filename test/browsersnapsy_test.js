var grunt = require('grunt');
var fs = require('fs');

exports.browsersnapsy = {
  setUp: function(done) {
    done();
  },
  tautologic_test: function(test) {
    test.expect(1);

    test.equal(1, 1, 'should have super useful expectations');

    test.done();
  }
};
