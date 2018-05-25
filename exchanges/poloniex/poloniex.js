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


exports.getOrderBookV2 = function (req) {
    console.log("getOrderBookV2 Poloniex");
    let market = req.body;
    if(typeof market !== undefined){
        var base = market.base.toUpperCase();
        var pair = market.pair.toUpperCase();
        const req_url = api_url+orderbook_param+base+seperator+pair;
        return new Promise((resolve, reject) => {
            https.get(req_url, (resp) => {
                let body = '';
                resp.on('data', (chunk) => {
                    body += chunk;
                });
                resp.on('end', () => {
                    console.log('Got poloniex resp');
                    resolve(standardizeFormattingV2(JSON.parse(body)));
                });
            })
            .on('error', (err) => {
                reject(err);
            });
        })
        .catch((err) => {
            console.log("Error getOrderBookV2 poloniex");
            console.log(JSON.stringify(err));
            return err;
        });
        
    }
    else{
		return new Promise((resolve,reject) => {
			reject({message:"You must define the market"});
		});
	}
}

function standardizeFormattingV2(market_data) {
    if (typeof market_data !== null) {
        return new Promise((resolve, reject) => {
            var asks = [];
            for (var i = 0; i < market_data.asks.length; i++) {
                var ask = market_data.asks[i];
                var rate = ask[0];
                var quantity = ask[1];
                var asks_r = {
                    'rate': rate,
                    'quantity': quantity
                };
                asks.push(asks_r);
            }
            resolve(asks);
        })
        .then((asks) => {
            var formatted_data = {
                'sell': asks
            };
            let buys = [];
            for (var i = 0; i < market_data.asks.length; i++) {
                var bid = market_data.bids[i];
                var rate = bid[0];
                var quantity = bid[1];
                buys.push({ 'rate': rate, 'quantity': quantity });
            }
            formatted_data.buys = buys;
            return formatted_data;
        })
        .catch((err) => {
            console.log("Error: standarizeFormattingV2");
            console.log(JSON.stringify(err));
            return err;
        });        
    }
}