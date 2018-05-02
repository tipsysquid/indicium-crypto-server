var https = require('https');
var bittrex = require('../exchanges/bittrex/bittrex.js');
//const bittrex = 'https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-LTC&type=both';

exports.getBooks = function(req, res, callback){
	console.log("Fetching orders");
		https.get(bittrex, (resp) => {
			let body = '';
			resp.on('data', (chunk) => {
				body+=chunk;
			});
			resp.on('end', () => {
				console.log("Got response");
			//	console.log(JSON.parse(body));
				return res.status(200).send(JSON.parse(body));
			});	

	})
	.on('error', (err) => {
		console.log("Error: "+ err.message);
		return res.status(500).send({message:"Unable to fetch order books"});
	})
}

exports.getBittrex = function(req, res, callback){
	console.log("getBittrex");
	return bittrex.getBooks(req, res, callback);
}

exports.getUnified = function(req, res, callback){
	console.log("getUnified");
	return new Promise((resolve, reject) => {
		bittrex.getOrderBook(req)
		.then((resp,err) => {
			if(err){
				reject(err);
				return;
			}
			else{
				return resolve(res.status(200).send(resp));
				
			}
		
		});
			
	});

}
