const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../../src/index');
const should = chai.should();
const userRepository = require('./../../src/dataAccess/userRepository');

chai.use(chaiHttp);

describe('/Users', () => {
    beforeEach(async () => {
        await userRepository.initializeTestData();
    });

    after(() => {
        server.stop();
    });

    describe('GET', () => {
        it('should return all users', async () => {
            const res = await getAsAdmin('/users');

            res.should.have.status(200);

            res.body.should.deep.equal([
                { userName: 'admin', email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' },
                { userName: 'user1', email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' },
            ]);
        });

        it('should return all users for unauthenticated request', async () => {
            const res = await getWithoutAuth('/users');

            res.should.have.status(200);

            res.body.should.deep.equal([
                { userName: 'admin', profileImage: 'http://profile.pic/1' },
                { userName: 'user1', profileImage: 'http://profile.pic/2' },
            ]);
        });
    });

    describe('POST', () => {
        const testUser = { userName: 'testUser', password: 'pwd', email: 'testUser@wellochat.com', isAdmin: false, profileImage: 'http://profile.pic/3' };

        it('should create user', async () => {
            const res = await postAsAdmin('/users', testUser);
            res.should.have.status(200);
            res.body.should.deep.equal(testUser);

            const usersRes = await getAsAdmin('/users');
            usersRes.body.should.deep.include({ userName: testUser.userName, profileImage: testUser.profileImage, email: testUser.email });
        });

        it('should reject with HTTP 403 if caller is not admin', async () => {
            const res = await postAsUser('/users', testUser);
            res.should.have.status(403);
        });

        it('should reject with HTTP 401 if caller is not authenticated', async () => {
            const res = await postWithoutAuth('/users', testUser);
            res.should.have.status(401);
        });
    });
});

function getAsAdmin(url) {
    return chai.request(server).get(url).auth('admin', 'admin');
}

function getWithoutAuth(url) {
    return chai.request(server).get(url);
}

function postAsAdmin(url, body) {
    return chai.request(server).post(url).auth('admin', 'admin').send(body);
}

function postAsUser(url, body) {
    return chai.request(server).post(url).auth('user1', 'user1').send(body);
}

function postWithoutAuth(url, body) {
    return chai.request(server).post(url).send(body);
}
