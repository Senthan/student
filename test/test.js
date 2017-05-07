var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where application is runninng.

var server = supertest.agent("http://localhost:3001");

// UNIT test begin

describe("unit test",function(){

  // #1 should add label and value
 it("should add label and value",function(done){

    //calling add label and value api
    server
    .post('/user')
    .send({label : 'sen', value : 'senthan'})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res) {
      res.statusCode.should.equal(200);
      done();
    });
  });


 it("should return 404",function(done){
    server
    .get("/random")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  })


 it("should return 201",function(done){
    server
    .get("/user/sen")
    .expect(201)
    .end(function(err,res){
      res.status.should.equal(201);
      done();
    });
  })

  it("should return 201",function(done){
    server
    .get("/user/sen?timestamp=0")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  })

});