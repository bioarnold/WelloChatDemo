const userRepository = require('./../dataAccess/userRepository');
const transformer = require('./../transformers/userTransformer');
const { ForbiddenError } = require('./../exceptions/customErrors');

let currentUser;

async function authenticate({ userName, password }) {
    return userRepository.getForAuth(userName, password);
}

async function getAll() {
    return transformer.transformList(await userRepository.getUsers(), !!currentUser);
}

async function addUser(user) {
    if (currentUser && !currentUser.isAdmin) {
        throw new ForbiddenError('Function available to admins only');
    }

    if (!user) return;

    return transformer.transform(await userRepository.addUser(user), true);
}

async function getUser(id) {
    return transformer.transform(await userRepository.getUser(id), !!currentUser);
}

async function removeUser(id) {
    if (currentUser && !currentUser.isAdmin) {
        throw new ForbiddenError('Function available to admins only');
    }

    return userRepository.removeUser(id);
}

async function updateUser(id, user) {
    if (currentUser && !currentUser.isAdmin) {
        throw new ForbiddenError('Function available to admins only');
    }

    return userRepository.updateUser(id, user);
}

async function findUser(userQuery) {
    return transformer.transformList(await userRepository.findUser(userQuery), !!currentUser);
}

function setCurrentUser(user) {
    currentUser = user;
}

module.exports = {
    authenticate,
    getAll,
    addUser,
    getUser,
    removeUser,
    updateUser,
    setCurrentUser,
    findUser,
};
