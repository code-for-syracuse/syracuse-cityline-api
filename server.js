// Include required modules.
const request = require('request');
const async = require('async');
const express = require('express');
const bodyParser = require('body-parser');
const utilities = require('./utilities');
const config = require('./config').config;

// Set up Express app.
const app = express();
app.use(bodyParser.json());
let server;

exports.start = function () {
	let port = process.argv[2] || 2000;
	server = app.listen(port);
}
exports.stop = function () {
	server.close();
}
exports.app = app;

// Routes to expose.
app.get('/', (req, res) => {
	res.status(400).json({
		message: 'You must select an appropriate route for your request'
	});
});

app.get('/application/:id', (req, res) => {
	getRecords(req, res);
});

app.get('/permit/:id', (req, res) => {
	getRecords(req, res);
});

app.get('/complaint/:id', (req, res) => {
	getRecords(req, res);
});

// Primary function to lookup records.
let getRecords = (req, res) => {

	// Get the record type.
	let recordType = req.path.substring(1, req.path.indexOf('/', 2));
	// Translate to record code for search.
	let type = utilities.getTypeCode(recordType);
	// Get the record ID.
	let id = req.params.id;

	async.waterfall([
			async.apply(getFormData, {
					type: type,
					id: id
				}),
				searchTransactionId,
				searchRecords
		],
		(error, body, record) => {
			if (!error) {
				let recordInformation = utilities.getRecordInformation(body, record);
				if (req.query.callback) {
					res.jsonp(recordInformation);
				} else {
					res.json(recordInformation);
				}
			} else {
				var error_message = typeof (error.message) != 'undefined' ? error.message : "Unable to retrieve information.";
				var error_code = typeof (error.code) != 'undefined' ? error.code : 500;
				res.status(error_code).json({
					error: error_message
				});
			}
		});
}

// Get the viewstate & related bits for record lookup.
let getFormData = (record, callback) => {
	request(config.URL_BASE + config.TRANSACTION_PATH, (error, response, body) => {
		callback(error, body, record);
	});
}

// Do postback with record type and id.
let searchTransactionId = (body, record, callback) => {
	let viewStateData = utilities.getViewState(body);
	let formData = {
		__VIEWSTATE: viewStateData.viewState,
		__VIEWSTATEGENERATOR: viewStateData.viewStateGenerator,
		__EVENTVALIDATION: viewStateData.eventValidation,
		ctl00$ctl00$ctl00$content$content$content$ddlTypes: record.type,
		ctl00$ctl00$ctl00$content$content$content$txtId: record.id,
		ctl00$ctl00$ctl00$content$content$content$btnSearch: 'Search'
	};
	request.post({
		url: config.URL_BASE + config.TRANSACTION_PATH,
		form: formData
	}, (error, response) => {
		callback(error, response, record);
	});
}

// Look up record.
let searchRecords = (response, record, callback) => {
	if (response.statusCode == '302') {
		request(config.URL_BASE + response.headers.location, (error, response, body) => {
			callback(error, body, record);
		});
	} else {
		callback({
			error: 'Unable to lookup that record.'
		});
	}
}