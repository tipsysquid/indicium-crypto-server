/**
 * Poloniex API integration
 * Use this object to interact with the Poloniex exchange
 * 
 * requires autobahn for websockets
 */
var https = require('https');
var autobahn = require('autobahn');
var wsuri = "wss://api.poloniex.com";
var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});

const api_url = 'https://poloniex.com/public?';
const orderbook_param = 'command=returnOrderBook&currencyPair=';
const seperator = '_';
const limit_param = '&depth=';
const limit_value = '10';

var test;


connection.onopen = function (session) {
    function marketEvent (args,kwargs) {
            console.log(args);
    }
    function tickerEvent (args,kwargs) {
            console.log(args);
    }
    function trollboxEvent (args,kwargs) {
            console.log(args);
    }
    test = session.subscribe('BTC_XMR', marketEvent);
    session.subscribe('ticker', tickerEvent);
    session.subscribe('trollbox', trollboxEvent);
}

connection.onclose = function () {
    console.log("Websocket connection closed");
}
                   
connection.open();

exports.getOrderBook = function(req, callback){
    console.log("getOrderBook Poloniex");

    let market = req.body;
    if(typeof market !== undefined){
        var base = market.base.toUpperCase();
        var pair = market.pair.toUpperCase();
        const req_url = api_url+orderbook_param+base+seperator+pair;
        return new Promise((resolve, reject) => {
			https.get(req_url, (resp) => {
				let body = '';
				resp.on('data', (chunk) => {
					body+=chunk;
				});
				resp.on('end', () => {
					console.log('Got poloniex resp');
					resolve(JSON.parse(body));
					
				});
			})
			.on('error', (err) => {
				reject(err);
			});
        });
        
    }
    else{
		return new Promise((resolve,reject) => {
			reject({message:"You must define the market"});
		});
	}
}