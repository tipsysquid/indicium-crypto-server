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

/**
 * Returns an object containing the bittrex and poloniex markets
 * for a particular trading pair. They are not merged
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 */
exports.getUnifiedV3 = function (req, res) {
	var request = req;
	console.log("getUnifiedV3");
	bittrex.getOrderBook2(req)
		.then((book, err) => {
			if (err) {
				reject(err);
			}
			let markets = {
				bittrex: book
			};
			return markets;
		})
		.then((markets) => {
			return [markets, poloniex.getOrderBookV2(request)];
		})
		.then((markets_polo) => {
			var polo_promise = markets_polo[1];
			var markets = markets_polo[0];
			return polo_promise.then((book) => {
				return book;
			})
			.then((book) => {
				markets.poloniex = book;
				return markets;
			});
			
		})
		.then((markets) => {
			return res.status(200).send(markets);
		})
		.catch((err) => {
			return res.status(500).send(err);
		});
			
}
