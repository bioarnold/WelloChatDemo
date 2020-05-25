const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../../src/index');
const should = chai.should();

chai.use(chaiHttp);

describe('Get user list', () => {
    after(async () => {
        server.stop();
    });

    it('should return all users', (done) => {
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);

                res.body.should.deep.equal([
                    { userName: 'admin', email: 'admin@wellochat.com' },
                    { userName: 'user1', email: 'user1@wellochat.com' },
                ]);

                done();
            });
    });
});
