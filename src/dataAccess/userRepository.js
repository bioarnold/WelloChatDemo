// using in-memory DB for the sake of simplicity
const { AsyncNedb } = require('nedb-async');
const db = new AsyncNedb();

const insertTestData = async () => {
    await db.asyncInsert({ userName: 'admin', password: 'admin', email: 'admin@wellochat.com', isAdmin: true, profileImage: 'http://profile.pic/1' });
    await db.asyncInsert({ userName: 'user1', password: 'user1', email: 'user1@wellochat.com', isAdmin: false, profileImage: 'http://profile.pic/2' });
};

insertTestData();

function getUsers() {
    return db.asyncFind({}, [['sort', { userName: 1 }]]);
}

function getForAuth(userName, password) {
    return db.asyncFindOne({ userName: userName, password: password });
}

module.exports = { getUsers, getForAuth };
