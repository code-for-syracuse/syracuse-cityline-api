// Include required modules.
var request = require('request');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');

var utilities = require('./utilities');

// Local port to listen on.
var port = process.argv[2] || 2000;

// Set up Express app.
var app = express();
app.use(bodyParser.json());
app.listen(port)

// Record lookup endpoints
var URL_BASE = 'http://ipsweb.ci.syracuse.ny.us/';
var TRANSACTION_PATH = 'transactionsearch.aspx'
var PERMIT_APPLICATION_SEARCH_PATH = 'viewtranspa.aspx';
var PERMIT_SEARCH_PATH = 'viewtranspermit.aspx'

// Routes to expose.
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
	request(URL_BASE + TRANSACTION_PATH, function (error, response, body) {
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
	request.post({ url: URL_BASE + TRANSACTION_PATH, form: formData }, function (error, response) {
		callback(error, response, record);
	});
}

// Look up record.
function searchRecords(response, record, callback) {
	if(response.statusCode == '302') {
		request(URL_BASE + response.headers.location, function(error, response, body) {
			callback(error, body, record);
		});
	}
	else {
		callback({ error: 'Unable to lookup that record.' });
	}
}



