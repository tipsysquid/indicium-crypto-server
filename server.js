///========================
// SETUP
// ========================
//

var env = 'local';
var config = require('./config/config.'+env+'.js');
var debug = config.debug;

// IMPORT MODULES

var express =  require('express');
var bodyParser = require('body-parser');
var http = require('http');

//App configuration:w
//
let app = express();
var port = 3000;
let httpServer;

app.use(bodyParser.json({ limit: '5mb'}));
app.use(bodyParser.urlencoded({extended : true}));

startServer();

function startServer(callback){
	new Promise((resolve, reject) => {
		var httpServer = http.createServer(app).listen(port, resolve)
		resolve(httpServer);
	})
	.then((res) => {
		addRoutes();
	})
	.then(() => {
		console.log('Server listening on port: '+port);
	})
	.catch(function(ex){
		console.log(ex);
		process.exit();
	});

}

function addRoutes(callback){
	return new Promise((resolve, reject) => {
		require('./routes/orderbook.js')(app);
		var status = "Added Routes";
		resolve(status);
	})
	.then((status) => {
		console.log(status);
	})
	.catch((ex) => {
		console.log(ex);
		console.log('Failed to add Routes');
		process.exit();

	});
}
