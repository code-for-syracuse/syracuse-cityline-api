const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

let application = 'PC-0222-14';
let permit = 'PC-0222-14';
let complaint = '2013-27037';

describe('Syracuse Cityline API', () => {
	before(() => {
		server.start();
	});

	describe('Tests', () => {

		it('Should return valid JSON for applications', (done) => {
			chai.request(server.app)
				.get(`/application/${application}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('id');
					done();
				});
		});

		it('Should return valid JSON for permits', (done) => {
			chai.request(server.app)
				.get(`/permit/${permit}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('id');
					done();
				});
		});

		it('Should return valid JSON for complaints', (done) => {
			chai.request(server.app)
				.get(`/complaint/${complaint}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('id');
					done();
				});
		});

		it('Should return 400 if invalid route selected', (done) => {
			chai.request(server.app)
				.get('/')
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.json;
					done();
				});
		});

	});

	after((done) => {
		server.stop();
		done();
	});
});