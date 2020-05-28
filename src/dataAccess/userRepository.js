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
    const userToInsert = { id: nextId++, ...user };

    await db.asyncInsert(userToInsert);
    return userToInsert;
}

async function getUser(id) {
    const user = await db.asyncFindOne({ id: +id });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
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

async function findUser(userQuery) {
    const query = [];

    if (userQuery.userName) {
        query.push({ userName: new RegExp(userQuery.userName) });
    }
    if (userQuery.email) {
        query.push({ email: new RegExp(userQuery.email) });
    }
    if ('isAdmin' in userQuery) {
        query.push({ isAdmin: userQuery.isAdmin === 'true' });
    }
    if (userQuery.profileImage) {
        query.push({ profileImage: new RegExp(userQuery.profileImage) });
    }

    return db.asyncFind({ $and: query }, [['sort', { userName: 1 }]]);
}

module.exports = { getUsers, getForAuth, addUser, initializeTestData, getUser, removeUser, updateUser, findUser };
