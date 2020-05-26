// using in-memory DB for the sake of simplicity
const { AsyncNedb } = require('nedb-async');
const db = new AsyncNedb();
const transformer = require('./../transformers/userTransformer');

const insertTestData = async () => {
    await db.asyncInsert({ userName: 'admin', password: 'admin', email: 'admin@wellochat.com' });
    await db.asyncInsert({ userName: 'user1', password: 'user1', email: 'user1@wellochat.com' });
};

insertTestData();

async function getUsers() {
    return transformer.transformList(await db.asyncFind({}, [['sort', { userName: 1 }]]));
}

async function getForAuth(userName, password) {
    return db.asyncFindOne({ userName: userName, password: password });
}

module.exports = { getUsers, getForAuth };
