// Include required modules.
var request = require('request');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var utilities = require('./utilities');
var config = require('./config').config;

// Set up Express app.
var app = express();
app.use(bodyParser.json());
var server;

exports.start = function () {
	var port = process.argv[2] || 2000;
	server = app.listen(port);
}
exports.stop = function() {
	server.close();
}
exports.app = app;

// Routes to expose.
app.get('/', function(req, res) {
	res.status(400).json({ message: 'You must select an approirate route for your request'});
});

app.get('/application/:id', function(req, res) {
	getRecords(req, res);
});

app.get('/permit/:id', function(req, res) {
	getRecords(req, res);
});

app.get('/complaint/:id', function(req, res) {
	getRecords(req, res);
});

// Primary function to lookup records.
function getRecords(req, res) {

	// Get the record type.
	var recordType = req.path.substring(1, req.path.indexOf('/', 2));
	// Translate to record code for search.
	var type = utilities.getTypeCode(recordType);
	// Get the record ID.
	var id = req.params.id;

	async.waterfall([
		async.apply(getFormData, {type: type, id: id}),
		searchTransactionId,
		searchRecords
		],
		function(error, body, record) {
			if(!error) {
				var recordInformation = utilities.getRecordInformation(body, record);
				if(req.query.callback) {
					res.jsonp(recordInformation);
				}
				else {
					res.json(recordInformation);
				}
			}
			else {
				var error_message = typeof(error.message) != 'undefined' ? error.message  : "Unable to retrieve information.";
				var error_code = typeof(error.code) != 'undefined' ? error.code : 500;
				res.status(error_code).json({error: error_message});
			}
		});
}

// Get the viewstate & related bits for record lookup.
function getFormData(record, callback) {
	request(config.URL_BASE + config.TRANSACTION_PATH, function (error, response, body) {
		callback(error, body, record);
	});
}

// Do postback with record type and id.
function searchTransactionId(body, record, callback) {
	var viewStateData = utilities.getViewState(body);
	var formData = {
		__VIEWSTATE: viewStateData.viewState,
		__VIEWSTATEGENERATOR: viewStateData.viewStateGenerator,
		__EVENTVALIDATION: viewStateData.eventValidation,
		ctl00$ctl00$ctl00$content$content$content$ddlTypes: record.type,
		ctl00$ctl00$ctl00$content$content$content$txtId: record.id,
		ctl00$ctl00$ctl00$content$content$content$btnSearch: 'Search'
	};
	request.post({ url: config.URL_BASE + config.TRANSACTION_PATH, form: formData }, function (error, response) {
		callback(error, response, record);
	});
}

// Look up record.
function searchRecords(response, record, callback) {
	if(response.statusCode == '302') {
		request(config.URL_BASE + response.headers.location, function(error, response, body) {
			callback(error, body, record);
		});
	}
	else {
		callback({ error: 'Unable to lookup that record.' });
	}
}



