var _ = require('lodash'),
  moment = require('moment'),
  parser = require('subtitles-parser'),
  fs = require('fs');


var text2srt = (function() {
  var mod = {};

  mod.convert = function(data) {
    var srtObject = function() {
      this.id = '0';
      this.startTime = '00:00:00,000';
      this.endTime = '00:00:00,000';
      this.text = '';
    },
      arrayOfSrt = [];

    var srt = data.split("//");
    _.each(srt, function(el, index) {
      var instance = new srtObject();
      instance.id = index + 1;
      instance.text = el;
      var startTime = index + 1 + 0.200;
      instance.startTime = moment(startTime, 'ss,SSS').format("HH:mm:ss,SSS");
      instance.endTime = moment(startTime + 1, 'ss').format("HH:mm:ss,SSS");
      arrayOfSrt.push(instance);
    });
    return arrayOfSrt;

  };

  mod.convertToArray = function(data, key) {
    if (!_.has(data[0], key)) {
      return 'No key named ' + key;
    } else {
      return _.pluck(data, key);
    }
  }

  mod.getSrtArray = function(data, key) {
    var srtList = mod.convertToArray(data, key),
      srt = [];
    _.each(srtList, function(el, index) {
      var element = {
        name: data[index].imagefilename.substr(0, data[index].imagefilename.length - 4),
        srt: mod.convert(el)
      }
      mod.createFileFromObject(element);
      srt.push(element);
    })
    return srt;
  }

  mod.createFileFromObject = function(data) {
    var srt = parser.toSrt(data.srt);
    fs.writeFile("/tmp/" + data.name + ".srt", srt, function(err) {
      if (err) throw err;
    });
  }

  mod.main = function() {
    var filename = process.argv[2];
    var data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' }));
    var key = process.argv[3];
    mod.getSrtArray(data,key)
  }

  return mod;

})();

// ignore exports for browser
if (typeof exports === 'object') {
  module.exports = text2srt;
} 

text2srt.main();