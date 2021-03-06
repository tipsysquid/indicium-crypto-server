/**
 * Bittrex API integration
 * Use this object to interact with the Bittrex exchange
 */

var https = require('https');

const api_version = 'v1.1';
const api_url = 'https://bittrex.com/api/'+api_version+'/public';
const orderbook_param = '/getorderbook?market=';
const seperator = '-';
const type_param = '&type=';
const type_value = 'both';

//
//Get order books for a particular pair of currencies
//
exports.getBooks = function(req, res, callback){
	console.log("Fetching bittrex orderbook");
	let market = req.body;	
	console.log('market: '+market);
	if(typeof market !== 'undefined'){
		var base = market.base;
		var pair = market.pair;
		const req_url = api_url+orderbook_param+base+seperator+pair+type_param+type_value;
		console.log(req_url);
		https.get(req_url, (resp) => {
			let body = '';
			resp.on('data', (chunk) => {
				body+=chunk;
			});
			resp.on('end', () => {
				console.log("Got bittrex resp");
				return res.status(200).send(JSON.parse(body));
			});
		})
		.on('error', (err) => {
			console.log("Error: "+ err.message);
			return res.status(500).send({message:"Unable to fetch bittrex order book"});
		});
	}
	else{
		return res.status(500).send({message:"You must define the order book"});
	}
}

exports.getOrderBook2 = function (req, callback) {
	console.log("getOrderBook2 Bittrex");
	return new Promise((resolve, reject) => {
		let market = req.body;
		if ((typeof market != 'undefined') && (Object.keys(market).length > 0)) {
			var base = market.base;
			var pair = market.pair;
			const req_url = api_url + orderbook_param + base + seperator + pair + '&type=both';
			resolve(req_url);
		}
		else {
			reject({ message: "Missing paramter base or pair" });
		}
	})
	.then((req_url) => {
		return new Promise((resolve, reject) => {
			https.get(req_url, (resp) => {
				let body = '';
				resp.on('data', (chunk) => {
					body += chunk;
				});
				resp.on('end', () => {
					console.log('Got bittrex resp');
					resolve(JSON.parse(body));
					
				});
			})
				.on('error', (err) => {
					reject(err);
				});
		})
		.then((res) => {
			return res.result;	
		})
		.catch((err) => {
			return err;
		})
		
	})
	.then((result) => {
		return result;
	})	
	.catch((err) => {
		console.log("error in bittrex.getOrderBook2");
		console.log(JSON.stringify(err));
		return err;
	});
}
