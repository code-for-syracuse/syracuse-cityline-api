const cheerio = require('cheerio');

// Get record type code for search.
exports.getTypeCode = (type) => {
	switch (type) {
		case 'application':
			return 0;
		case 'permit':
			return 1;
		case 'complaint':
			return 2;
	}
};

// Get view state information.
exports.getViewState = (body) => {
	$ = cheerio.load(body);
	let viewState = $('#__VIEWSTATE').attr('value');
	let viewStateGenerator = $('#__VIqqEWSTATEGENERATOR').attr('value');
	let eventValidation = $('#__EVENTVALIDATION').attr('value');
	return {
		viewState: viewState,
		viewStateGenerator: viewStateGenerator,
		eventValidation: eventValidation
	};
};

// Get information about the record.
exports.getRecordInformation = (body, record) => {
	$ = cheerio.load(body);

	// Set  type and status based on record type.
	let type = record.type == 2 ? '#content_line1description_lblType' : '#content_line2description_lblType';
	let status = record.type == 2 ? '#content_line2description_lblStatus' : '#content_line3description_lblStatus';

	let actions = '',
		inspections = '',
		violations = '';

	//Actions, inspections & violations contain multiple values in a table row.
	$('#content_specificinfo_divActions td').each(() => {
		actions += $(this).text() + ' ';
	});

	$('#content_specificinfo_divInspections td').each(() => {
		inspections += $(this).text() + ' ';
	});

	$('#content_specificinfo_divViolations td').each(() => {
		violations += $(this).text() + ' ';
	});

	// Construct response.
	let response = {
		id: $('#content_headerrecordnumber_lblRecord').text() || null,
		type: $(type).text() || null,
		status: $(status).text() || null,
		address: $('#content_headeraddress_lblAddress').text() || null,
		dates: $('#content_headerdate_lblDate').text() || null,
		description: $('#content_descriptiondescription_lblDescription').text() || null,
		actions: actions || null,
		inspections: inspections || null,
		violations: violations || null
	}
	return response;
}