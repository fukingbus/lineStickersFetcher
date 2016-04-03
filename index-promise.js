'use strict';

const Promise = require("bluebird");
const request = require('request-promise');
const fs = Promise.promisifyAll(require("fs"));

const linkBase = 'http://php-necroa.rhcloud.com/stickerline.php?stickerid=';

var stickerOrigin;
var main = function() {
  console.log('Fetching origin sticker links...');
  getLinks().then(scheduler);
};
var getLinks = function() {
  let stickerId = '1033821';
  return request(linkBase + stickerId)
    .then(function(body) {
      return (JSON.parse(body)).link;
    })
    .catch(function(err) {
      console.log('ERROR OCCURED , retrying...');
      main();
    });
};
var scheduler = function(stickerOrigin) {
  let i = 0;
  let len = stickerOrigin.length;
  return Promise.map(stickerOrigin, function(url) {
    let filename = url.replace(/^.*[\\\/]/, '');
    console.log('downloading ' + filename + ' (' + (i + 1) + '/' + len + ' , ' + ((i / len) * 100) + '%)');
    return download(url, filename)
      .then(function() {
        i++;
      })
      .catch(function(err){
        throw err;
        // console.log('Error occured , retrying');
        // i--;
      });
  }, {concurrency: 1});
};
var download = function(url, filename) {
  return request({
    method: 'POST',
    uri: 'http://waifu2x.udp.jp/api',
    form: {
      url: url,
      style: 'art',
      noise: 0,
      scale: 2
    },
    encoding: null
  }).then(function(body) {
    return saveImg(filename, body);
  })
    .catch(function(err) {
      throw err;
      return;
    });
};
var saveImg = function(filename, data) {
  return fs.writeFileAsync(filename, data)
    .then(function() {
      console.log(filename + ' saved!');
    })
    .catch(function(err) {
      console.log(err);
    });
};
main();
