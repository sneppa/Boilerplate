
var express = require('express');
var bodyParser = require('body-parser');
var cors    = require('cors');
var app     = express();
var router  = express.Router();

app.use(cors());
app.use(bodyParser.json()); 


var ROUTES  = [ 'welcome', 'status', 'tasks' ];

if (ROUTES.length > 0) {

	ROUTES.forEach(function(route) {
		require(__dirname + '/routes/' + route)(router);
	});

}


app.use('/api', router);



module.exports = {

	listen: function(port) {

		port = typeof port === 'number' ? (port | 0) : null;


		if (port !== null) {

			app.listen(port);

			return true;

		} else {

			throw "listen(Number port): port is not a Number";

		}


		return false;

	}

};

