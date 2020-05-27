// using in-memory DB for the sake of simplicity
const { AsyncNedb } = require('nedb-async');
const db = new AsyncNedb();

async function initializeTestData() {
    await db.asyncRemove({}, { multi: true });

    await db.asyncInsert({ userName: 'admin', password: 'admin', email: 'admin@wellochat.com', isAdmin: true, profileImage: 'http://profile.pic/1' });
    await db.asyncInsert({ userName: 'user1', password: 'user1', email: 'user1@wellochat.com', isAdmin: false, profileImage: 'http://profile.pic/2' });
}

initializeTestData();

function getUsers() {
    return db.asyncFind({}, [['sort', { userName: 1 }]]);
}

function getForAuth(userName, password) {
    return db.asyncFindOne({ userName: userName, password: password });
}

async function addUser(user) {
    if (!user) {
        return;
    }

    await db.asyncInsert(user);
    return user;
}

module.exports = { getUsers, getForAuth, addUser, initializeTestData };
