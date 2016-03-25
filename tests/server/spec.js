'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server/server.js');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('Server Response', () => {
   it('should be talking to the database', (done) => {
   chai.request(server)
     .post('/feedback')
     .send({
           "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbmljYTEifQ.8taUFKT1pinL7FNkh1mUGB4dAsTczsbZBzm8ZH2KDtA",
           "huntID": "h4kKxuDC6l",
           "endTime": "3:03:29 PM",
           "distance": "2.33",
           "feedback": "good"
         })
     .end((err, res) => {
      res.body.should.be.a('array');
      done();
     });
   });

   it('should have a response status of 200', (done) => {
     chai.request(server)
      .post('/feedback')
      .send({
         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbmljYTEifQ.8taUFKT1pinL7FNkh1mUGB4dAsTczsbZBzm8ZH2KDtA",
         "huntID": "h4kKxuDC6l",
         "endTime": "3:03:29 PM",
         "distance": "2.33",
         "feedback": "good"
      })
      .end((err, res) => {
         res.should.have.status(200);
         done();
      })
   });

   it('should return a user token on signin', (done) => {
      chai.request(server)
       .post('/signin')
       .send({
         "username": "monica1",
         "password": "monica123"
       })
      .end((err, res) => {
         res.body.should.be.a('object');
         done();
      });
   });

});

//Fix later. The callback from the server is never sent; it's just a console.log().
// it('should return an error if a user tries to create a duplicate profile', (done) => {
//     chai.request(server)
//     .post('/signup')
//     .send({
//       "username": "monica1",
//       "password": "monica123"
//     })
//    .end((err, res) => {
//       res.body.should.be.a('object');
//       expect(res).to.have.status(400);
//       done();
//    })
//    // .catch((err) => {
//    //    throw err;
//    //    done();
//    // })
// });
