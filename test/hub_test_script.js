require('colors');
var chai = require('chai');
chai.should();

var wd = require('wd'),
    HUB_PORT_4444_TCP_ADDR = process.env.HUB_PORT_4444_TCP_ADDR || '45.79.106.150',
    HUB_PORT_4444_TCP_PORT = process.env.HUB_PORT_4444_TCP_PORT || 4444;

module.exports = function(browserName) {
  var logPrefix = ('[' + browserName + '] ').grey;
  var browser = wd.remote({
    hostname: HUB_PORT_4444_TCP_ADDR,
    port: HUB_PORT_4444_TCP_PORT
  });

  // optional extra logging
  browser.on('status', function(info) {
    console.log(logPrefix + info.cyan);
  });
  browser.on('command', function(eventType, command, response) {
    console.log(logPrefix + ' > ' + eventType.cyan, command, (response || '').grey);
  });
  browser.on('http', function(meth, path, data) {
    console.log(logPrefix + ' > ' + meth.magenta, path, (data || '').grey);
  });

  browser.init({
    browserName: browserName
  }, function() {
    browser.get("https://d3js.org/", function() {
      browser.title(function(err, title) {
        if (err) {
          console.error(err);
          browser.quit();
          process.exit(1);
        }

        title.should.include('D3');
        browser.quit();
      })
    });
  });
};
