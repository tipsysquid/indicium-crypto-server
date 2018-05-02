module.exports = function(app) {
	
	var orderbooks = require('../controllers/orderbook.js');

	//get orderbook data from available exchanges for a 
	//particular market
	app.get('/orderbooks', orderbooks.getBooks);
	
	app.post('/unified', orderbooks.getUnified);
}
