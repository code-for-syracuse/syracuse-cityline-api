var cheerio = require('cheerio');

// Get record type code for search.
exports.getTypeCode = function(type) {
	switch(type) {
		case 'application': return 0;
		case 'permit': return 1;
		case 'complaint': return 2;
	}
};

// Get view state information.
exports.getViewState = function(body) {
	$=cheerio.load(body);
	var viewState = $('#__VIEWSTATE').attr('value');
	var viewStateGenerator = $('#__VIqqEWSTATEGENERATOR').attr('value');
	var eventValidation = $('#__EVENTVALIDATION').attr('value');
	return { viewState: viewState, viewStateGenerator: viewStateGenerator, eventValidation: eventValidation };
};

// Get information about the record.
exports.getRecordInformation = function(body, record) {
	$=cheerio.load(body);

	// Set  type and status based on record type.
	var type = record.type == 2 ? '#content_line1description_lblType' : '#content_line2description_lblType';
	var status = record.type == 2 ? '#content_line2description_lblStatus' : '#content_line3description_lblStatus';

	var actions = '', inspections = '', violations = '';

	//Actions, inspections & violations contain multiple values in a table row.
	$('#content_specificinfo_divActions td').each(function( index, value ) {
		actions += $(this).text() + ' ';
	});

	$('#content_specificinfo_divInspections td').each(function( index, value ) {
		inspections += $(this).text() + ' ';
	});

	$('#content_specificinfo_divViolations td').each(function( index, value ) {
		violations += $(this).text() + ' ';
	});

	// Consruct response.
	var response = {
		id: $('#content_headerrecordnumber_lblRecord').text() || null,
		type: $(type).text() || null,
		status: $(status).text() || null,
		address: $('#content_headeraddress_lblAddress').text() || null,
		dates: $('#content_headerdate_lblDate').text() || null,
		description: $('#content_descriptiondescription_lblDescription').text() || null,
		actions: actions || null,
		inspections: inspections || null,
		violations:  violations || null
	}
	return response;
}
