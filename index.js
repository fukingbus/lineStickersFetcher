var request = require('request-promise');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var main = async (function(){
	console.log('main');
	console.log(await (getLinks()));
	
});
var getLinks = async (function(){
  var stickerId = '1033821';
  var res = await( request('https://php-necroa.rhcloud.com/stickerline.php?stickerid='+stickerId)
  	.then(function (body){
	  	//console.log(body);
	  	return body;
	 }));
	 return (JSON.parse(res)).link;
});
main();