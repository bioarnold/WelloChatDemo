// using in-memory DB for the sake of simplicity
const { AsyncNedb } = require('nedb-async');
const db = new AsyncNedb();
const { NotFoundError } = require('../exceptions/customErrors');

async function initializeTestData() {
    await db.asyncRemove({}, { multi: true });

    await db.asyncInsert({ id: 1, userName: 'admin', password: 'admin', email: 'admin@wellochat.com', isAdmin: true, profileImage: 'http://profile.pic/1' });
    await db.asyncInsert({ id: 2, userName: 'user1', password: 'user1', email: 'user1@wellochat.com', isAdmin: false, profileImage: 'http://profile.pic/2' });

    // this is clearly cheating, but will do for now :)
    nextId = 3;
}

let nextId = 0;

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

    const userToInsert = { id: nextId++, ...user };

    await db.asyncInsert(userToInsert);
    return userToInsert;
}

async function getUser(id) {
    return db.asyncFindOne({ id: +id });
}

async function removeUser(id) {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
        throw new NotFoundError('User not found');
    }

    return db.asyncRemove({ id: +id });
}

async function updateUser(userId, user) {
    // id, userName is not updateable
    const { id, userName, ...safeUser } = user;

    const existingUser = await this.getUser(userId);
    if (!existingUser) {
        throw new NotFoundError('User not found');
    }

    return db.asyncUpdate({ id: +userId }, { ...existingUser, ...safeUser });
}

module.exports = { getUsers, getForAuth, addUser, initializeTestData, getUser, removeUser, updateUser };
