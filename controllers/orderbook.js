var https = require('https');
var bittrex = require('../exchanges/bittrex/bittrex.js');
var poloniex = require('../exchanges/poloniex/poloniex.js');
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

exports.getPoloniex = function(req, res, callback){
	console.log("getPoloniex");
	poloniex.open();
}

exports.getUnifiedV1 = function(req, res, callback){
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

/**
 * Returns an object containing the bittrex and poloniex markets
 * for a particular trading pair. They are not merged
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 */
exports.getUnifiedV2 = function(req, res, callback){
	console.log("getUnifiedV2");
	return new Promise((resolve, reject) => {
			bittrex.getOrderBook(req)
			.then((book,err) => {
				if(err){
					reject(err);
					return;
				}
				else{
					let markets = {
						bittrex: book
					};
					return markets;				
				}		
			})
			.then((markets) => {
				return markets.poloniex = new Promise((resolve,reject) => {
					poloniex.getOrderBook(req)
					.then((resp) => {
						markets.poloniex = resp;
						return resolve(markets);
					})
					.catch((err) => {
						return reject(err);
						
					});
				});
			})
			.then((markets) => {
				return res.status(200).send(markets);
			})
			.catch((err) => {
				return res.status(500).send(err);
			});				
	});
	






}


function mergeMarkets(markets, callback){
	
}