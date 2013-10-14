var expect = require('expect.js'),
    txt2srt = require('..');

var fs = require('fs');
var wrongkey = "summ";
var goodKey = "summary";
var listOfSrt = [];

var fullData = JSON.parse(fs.readFileSync('./test/data.json', { encoding: 'utf-8' }));
var dataPart = fullData[0];

describe('txt2srt', function() {

  it('should say no key named summ', function(done){
    expect(txt2srt.convertToArray(dataPart, wrongkey)).to.equal('No key named summ');
    done();
  });

  it('should return an array not empty', function(done){
    expect(txt2srt.convert(dataPart.summary)).to.not.be.empty();
    done();
  });
  
  it('should convert an array of '+fullData.length+' json object into an array of string', function(done){
    expect(txt2srt.convertToArray(fullData, goodKey)).to.be.an('array');
    expect(txt2srt.convertToArray(fullData, goodKey)).to.have.length(fullData.length);
    expect(txt2srt.convertToArray(fullData, goodKey)[0]).to.be.a('string');
    done();
  });

  it('should convert an array of '+fullData.length+' json object into an array of srt and filename', function(done){
    listOfSrt = txt2srt.getSrtArray(fullData, goodKey);
    expect(listOfSrt).to.be.an('array');
    expect(listOfSrt).to.have.length(fullData.length);
    expect(listOfSrt[0]).to.only.have.keys('name','srt');
    done();
  });

  /*describe('#createFileFromObject()', function(){
    it('should save without error', function(done){
      txt2srt.createFileFromObject(listOfSrt[0], function(err){
        if (err) throw err;
        done();
      });
    });
  });*/


});
