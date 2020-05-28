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

    describe('/users', () => {
        describe('GET', () => {
            it('should return all users', async () => {
                const res = await getAsAdmin('/users');

                res.should.have.status(200);

                res.body.should.deep.equal([
                    { id: 1, userName: 'admin', isAdmin: true, email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' },
                    { id: 2, userName: 'user1', isAdmin: false, email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' },
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

                const { password, ...testUserWithoutPassword } = testUser;
                res.body.should.deep.equal({ id: 3, ...testUserWithoutPassword });

                const usersRes = await getAsAdmin('/users');
                usersRes.body.should.deep.include({ id: 3, ...testUserWithoutPassword });
            });

            it('should return HTTP 403 if caller is not admin', async () => {
                const res = await postAsUser('/users', testUser);
                res.should.have.status(403);
                res.body.should.deep.equal({ code: 403, error: 'Function available to admins only' });
            });

            it('should return HTTP 401 if caller is not authenticated', async () => {
                const res = await postWithoutAuth('/users', testUser);
                res.should.have.status(401);
            });

            it('should return HTTP 401 if invalid credentials were provided', async () => {
                const res = await postWithInvalidCredentials('/users', testUser);
                res.should.have.status(401);
                res.body.should.deep.equal({ code: 401, error: 'Invalid Authentication Credentials' });
            });

            it('should return HTTP 400 if request body is invalid', async () => {
                const res = await postAsAdmin('/users', { blah: 'blah' });
                res.should.have.status(400);
                res.body.should.deep.equal({ code: 400, error: 'Invalid request' });
            });
        });
    });

    describe('/users:id', () => {
        describe('GET', () => {
            it('should return specified user', async () => {
                const res = await getAsAdmin('/users/1');

                res.should.have.status(200);

                res.body.should.deep.equal({ id: 1, userName: 'admin', isAdmin: true, email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' });
            });

            it('should return specified user for unauthenticated request', async () => {
                const res = await getWithoutAuth('/users/1');

                res.should.have.status(200);

                res.body.should.deep.equal({ id: 1, userName: 'admin', profileImage: 'http://profile.pic/1' });
            });

            it('should return HTTP 404 if user is not found', async () => {
                const res = await getWithoutAuth('/users/3');

                res.should.have.status(404);
                res.body.should.deep.equal({ code: 404, error: 'User not found' });
            });
        });

        describe('DELETE', () => {
            it('should remove specified user', async () => {
                const res = await deleteAsAdmin('/users/2');
                res.should.have.status(200);

                const userRes = await getAsAdmin('/users/2');
                userRes.should.have.status(404);
            });

            it('should return HTTP 403 if caller is not admin', async () => {
                const res = await deleteAsUser('/users/2');
                res.should.have.status(403);
                res.body.should.deep.equal({ code: 403, error: 'Function available to admins only' });

                // user should still exist
                const userRes = await getAsAdmin('/users/2');
                userRes.should.have.status(200);
            });

            it('should return HTTP 401 if caller is not authenticated', async () => {
                const res = await deleteWithoutAuth('/users/1');
                res.should.have.status(401);

                // user should still exist
                const userRes = await getAsAdmin('/users/2');
                userRes.should.have.status(200);
            });

            it('should return HTTP 404 if user does not exist', async () => {
                const res = await deleteAsAdmin('/users/3');
                res.should.have.status(404);
                res.body.should.deep.equal({ code: 404, error: 'User not found' });
            });

            it('should return HTTP 401 if invalid credentials were provided', async () => {
                const res = await deleteWithInvalidCredentials('/users/3');
                res.should.have.status(401);
                res.body.should.deep.equal({ code: 401, error: 'Invalid Authentication Credentials' });
            });
        });

        describe('PUT', () => {
            const updateUserReq = { email: 'newemail@wellochat.com', isAdmin: true, profileImage: 'http://newimage.test' };

            it('should update specified user', async () => {
                const res = await putAsAdmin('/users/2', updateUserReq);
                res.should.have.status(200);

                const userRes = await getAsAdmin('/users/2');
                userRes.should.have.status(200);
                userRes.body.should.deep.equal({ ...userRes.body, ...updateUserReq });
            });

            it('should return HTTP 403 if caller is not admin', async () => {
                const userBeforeRes = await getAsAdmin('/users/2');

                const res = await putAsUser('/users/2', updateUserReq);
                res.should.have.status(403);
                res.body.should.deep.equal({ code: 403, error: 'Function available to admins only' });

                const userAfterRes = await getAsAdmin('/users/2');
                userAfterRes.should.have.status(200);
                userAfterRes.body.should.deep.equal(userBeforeRes.body);
            });

            it('should return HTTP 401 if caller is not authenticated', async () => {
                const userBeforeRes = await getAsAdmin('/users/2');

                const res = await putWithoutAuth('/users/2', updateUserReq);
                res.should.have.status(401);

                const userAfterRes = await getAsAdmin('/users/2');
                userAfterRes.should.have.status(200);
                userAfterRes.body.should.deep.equal(userBeforeRes.body);
            });

            it('should return HTTP 404 if user does not exist', async () => {
                const res = await putAsAdmin('/users/3', updateUserReq);
                res.should.have.status(404);
                res.body.should.deep.equal({ code: 404, error: 'User not found' });
            });

            it('should return HTTP 401 if invalid credentials were provided', async () => {
                const res = await putWithInvalidCredentials('/users/3', updateUserReq);
                res.should.have.status(401);
                res.body.should.deep.equal({ code: 401, error: 'Invalid Authentication Credentials' });
            });
        });
    });

    describe('/users/find', () => {
        describe('GET', () => {
            it('should return all users if no criteria is specified', async () => {
                const res = await getAsAdmin('/users/find');

                res.should.have.status(200);

                res.body.should.deep.equal([
                    { id: 1, userName: 'admin', isAdmin: true, email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' },
                    { id: 2, userName: 'user1', isAdmin: false, email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' },
                ]);
            });

            it('should search users by userName', async () => {
                const res = await getAsAdmin('/users/find?userName=adm');

                res.should.have.status(200);

                res.body.should.deep.equal([{ id: 1, userName: 'admin', isAdmin: true, email: 'admin@wellochat.com', profileImage: 'http://profile.pic/1' }]);
            });

            it('should search users by email', async () => {
                const res = await getAsAdmin('/users/find?email=user1@we');

                res.should.have.status(200);

                res.body.should.deep.equal([{ id: 2, userName: 'user1', isAdmin: false, email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' }]);
            });

            it('should search users by isAdmin', async () => {
                const res = await getAsAdmin('/users/find?isAdmin=false');

                res.should.have.status(200);

                res.body.should.deep.equal([{ id: 2, userName: 'user1', isAdmin: false, email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' }]);
            });

            it('should search users by profileImage', async () => {
                const res = await getAsAdmin('/users/find?profileImage=.pic/2');

                res.should.have.status(200);

                res.body.should.deep.equal([{ id: 2, userName: 'user1', isAdmin: false, email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' }]);
            });

            it('should search users by multiple criteria', async () => {
                const res = await getAsAdmin('/users/find?profileImage=.pic/2&email=user1&isAdmin=false');

                res.should.have.status(200);

                res.body.should.deep.equal([{ id: 2, userName: 'user1', isAdmin: false, email: 'user1@wellochat.com', profileImage: 'http://profile.pic/2' }]);
            });
        });
    });
});

// GET
function getAsAdmin(url) {
    return chai.request(server).get(url).auth('admin', 'admin');
}

function getWithoutAuth(url) {
    return chai.request(server).get(url);
}

// POST
function postAsAdmin(url, body) {
    return chai.request(server).post(url).auth('admin', 'admin').send(body);
}

function postAsUser(url, body) {
    return chai.request(server).post(url).auth('user1', 'user1').send(body);
}

function postWithoutAuth(url, body) {
    return chai.request(server).post(url).send(body);
}

function postWithInvalidCredentials(url, body) {
    return chai.request(server).post(url).auth('invalid', 'invalid').send(body);
}

// DELETE
function deleteAsAdmin(url) {
    return chai.request(server).delete(url).auth('admin', 'admin');
}

function deleteAsUser(url) {
    return chai.request(server).delete(url).auth('user1', 'user1');
}

function deleteWithoutAuth(url) {
    return chai.request(server).delete(url);
}

function deleteWithInvalidCredentials(url) {
    return chai.request(server).delete(url).auth('invalid', 'invalid');
}

// PUT
function putAsAdmin(url, body) {
    return chai.request(server).put(url).auth('admin', 'admin').send(body);
}

function putAsUser(url, body) {
    return chai.request(server).put(url).auth('user1', 'user1').send(body);
}

function putWithoutAuth(url, body) {
    return chai.request(server).put(url).send(body);
}

function putWithInvalidCredentials(url, body) {
    return chai.request(server).put(url).auth('invalid', 'invalid').send(body);
}
