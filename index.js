const request = require('request-promise');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const fs = require('fs');
//const pillow = require('sleep');
const imgFactory = require('lwip');

var stickerOrigin;
var main = async (function(){
	console.log('Fetching origin sticker links...');
	stickerOrigin = await (getLinks());
	await(scheduler());
});
var getLinks = async (function(){
  stickerId = '1033821';
  res = await( request('https://php-necroa.rhcloud.com/stickerline.php?stickerid='+stickerId)
  	.then(function (body){
	  	//console.log(body);
	  	return body;
	 })
	 .catch(function (err) {
        console.log('ERROR OCCURED , retrying...');
        main();
    }));
	 return (JSON.parse(res)).link;
});
var scheduler = async(function(){
	for(var i=0,len=stickerOrigin.length;i<len;i++){
		url = stickerOrigin[i];
		filename = url.replace(/^.*[\\\/]/, '');
		console.log('Downloading '+filename + ' ('+(i+1)+'/'+len+' , '+((i/len)*100) +'%)');
		try{
			res = await(download(url,filename));
		}
		catch(e){
			console.log('Error occured , retrying');
			i--;
		}
	}
});
var download = async(function(url){
	  	  res = await(request({
            method: 'POST',
            uri: 'http://waifu2x.udp.jp/api',
            form: {
                url: url,
                style: 'art',
                noise: 0,
                scale: 2
            },
            encoding: null
          }).then(function (body){
			  	return saveImg(filename,body);
			})
			.catch(function (err) {
		        throw err;
		        return ;
		    }));
});
var saveImg = (function(filename,data){
		return (fs.writeFile(filename,data, (err) => {
			  if (err) {
			  	console.log( err);
			  	return false;
			 }
			 console.log('> '+filename + ' saved!');
			 compress(filename);
			 return true;
		}));
});
var compress = async(function(filename){
		try{
			await (imgFactory.open(filename, function(err, image){
				  image.batch()
				  .scale(0.75)
				  .resize(512, 512)       
				  .writeFile('512_'+filename,'png', function(err){
				    	if(err)
				    		console.log(err);
				    	console.log('> '+filename+' Compressed');
				    });
				}));
		}
		catch(e){
			console.log(e);
		}
});
main();