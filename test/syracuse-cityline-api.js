var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Election information API', function () {
	before(function () {
		server.start();
	});

	describe('Tests', function() {

	  it('Should return valid JSON for applications', function(done) {
	  	chai.request(server.app)
	  	.get('/application/PC-0222-14')
	  	    .end(function(err, res){
		      res.should.have.status(200);
		      res.should.be.json;
		      res.body.should.have.property('id');
		      done();
		    });
	  });

	  it('Should return valid JSON for permits', function(done) {
	  	chai.request(server.app)
	  	.get('/permit/PC-0222-14')
	  	    .end(function(err, res){
		      res.should.have.status(200);
		      res.should.be.json;
		      res.body.should.have.property('id');
		      done();
		    });
	  });

	  it('Should return valid JSON for complaints', function(done) {
	  	chai.request(server.app)
	  	.get('/complaint/2013-27037')
	  	    .end(function(err, res){
		      res.should.have.status(200);
		      res.should.be.json;
		      res.body.should.have.property('id');
		      done();
		    });
	  });

	  it('Should return 400 if invalid route selected', function(done) {
	  	chai.request(server.app)
	  	.get('/')
	  	    .end(function(err, res){
		      res.should.have.status(400);
		      res.should.be.json;
		      done();
		    });
	  });

	});

	after(function () {
		server.stop();
	});
});