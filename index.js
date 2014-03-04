var _ = require('lodash'),
  moment = require('moment'),
  parser = require('subtitles-parser'),
  fs = require('fs');


var text2srt = (function() {
  var mod = {},
      delay = 1.0,
      duration = 1.0;

  mod.convert = function(data) {
    var srtObject = function() {
      this.id = '0';
      this.startTime = '00:00:00,000';
      this.endTime = '00:00:00,000';
      this.text = '';
    },
      arrayOfSrt = [];

    var srt = data.split("//");
    var currentTime = 0;
    _.each(srt, function(el, index) {
      var timeonscreen = 2.0 + (el.length)*0.02;
      if (el[el.length-2] == '.'){
        timeonscreen += 0.5;
      }
      var timebetweenlines = 0.002;
      var instance = new srtObject();
      instance.id = index + 1;

      if(el.match(/\S+/g).length > 4){
        var middle = Math.floor(el.length / 2);
        var before = el.lastIndexOf(' ', middle);
        var after = el.indexOf(' ', middle + 1);

        if (middle - before < after - middle) {
            middle = before;
        } else {
            middle = after;
        }
        var s1 = el.substr(0, middle);
        var s2 = el.substr(middle + 1);

        el = s1+"\r"+s2;
      }
      instance.text = el;
      //var startTime = index * (timeonscreen + timebetweenlines);
      currentTime += timebetweenlines;
      var startTime = currentTime;
      instance.startTime = moment(startTime, 'ss,SSS').format("HH:mm:ss,SSS");
      instance.endTime = moment(startTime + timeonscreen, 'ss,SSS').format("HH:mm:ss,SSS");
      /*
=======
      var startTime = index + delay + index * duration;
      instance.startTime = moment(startTime, 'ss,SSS').format("HH:mm:ss,SSS");
      instance.endTime = moment(startTime + duration, 'ss').format("HH:mm:ss,SSS");
>>>>>>> 55e8b7bc90c6b719fd8e2bf54202374fba76086f
*/
      arrayOfSrt.push(instance);
      currentTime += timeonscreen;
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
    fs.writeFile("srt/" + data.name + ".txt", srt, function(err) {
      if (err) throw err;
    });
  }

  mod.main = function() {
    var filename = process.argv[2];
    delay = Number(process.argv[4]);
    duration = Number(process.argv[5]);
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
