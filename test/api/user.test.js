const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../../src/index');
const should = chai.should();
const userRepository = require('./../../src/dataAccess/userRepository');

chai.use(chaiHttp);

describe('User endpoints', () => {
    beforeEach(async () => {
        await userRepository.initializeTestData();
    });

    after(() => {
        server.stop();
    });

    describe('/Users', () => {
        describe('GET', () => {
            it('should return all users', async () => {
                const res = await getAsAdmin('/users');

                res.should.have.status(200);

                res.body.should.deep.equal([
                    { id: 1, userName: 'admin', email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' },
                    { id: 2, userName: 'user1', email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' },
                ]);
            });

            it('should return all users for unauthenticated request', async () => {
                const res = await getWithoutAuth('/users');

                res.should.have.status(200);

                res.body.should.deep.equal([
                    { id: 1, userName: 'admin', profileImage: 'http://profile.pic/1' },
                    { id: 2, userName: 'user1', profileImage: 'http://profile.pic/2' },
                ]);
            });
        });

        describe('POST', () => {
            const testUser = { userName: 'testUser', password: 'pwd', email: 'testUser@wellochat.com', isAdmin: false, profileImage: 'http://profile.pic/3' };

            it('should create user', async () => {
                const res = await postAsAdmin('/users', testUser);
                res.should.have.status(200);

                const { isAdmin, password, ...testUserWithoutPassword } = testUser;
                res.body.should.deep.equal({ id: 3, ...testUserWithoutPassword });

                const usersRes = await getAsAdmin('/users');
                usersRes.body.should.deep.include({ id: 3, ...testUserWithoutPassword });
            });

            it('should return HTTP 403 if caller is not admin', async () => {
                const res = await postAsUser('/users', testUser);
                res.should.have.status(403);
                res.body.should.deep.equal({ error: 'Forbidden' });
            });

            it('should return HTTP 401 if caller is not authenticated', async () => {
                const res = await postWithoutAuth('/users', testUser);
                res.should.have.status(401);
            });
        });
    });

    describe('/Users:id', () => {
        describe('GET', () => {
            it('should return specified user', async () => {
                const res = await getAsAdmin('/users/1');

                res.should.have.status(200);

                res.body.should.deep.equal({ id: 1, userName: 'admin', email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' });
            });

            it('should return specified user for unauthenticated request', async () => {
                const res = await getWithoutAuth('/users/1');

                res.should.have.status(200);

                res.body.should.deep.equal({ id: 1, userName: 'admin', profileImage: 'http://profile.pic/1' });
            });

            it('should return HTTP 404 if user is not found', async () => {
                const res = await getWithoutAuth('/users/3');

                res.should.have.status(404);
                res.body.should.deep.equal({ error: 'User not found' });
            });
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
