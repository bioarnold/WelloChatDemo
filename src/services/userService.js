const userRepository = require('./../dataAccess/userRepository');
const transformer = require('./../transformers/userTransformer');
const { ForbiddenError } = require('./../exceptions/customErrors');

let currentUser;

async function authenticate({ userName, password }) {
    const user = await userRepository.getForAuth(userName, password);
    if (user) {
        return user;
    }
}

async function getAll(showProtected) {
    return transformer.transformList(await userRepository.getUsers(), showProtected);
}

async function addUser(user) {
    if (currentUser && !currentUser.isAdmin) {
        throw new ForbiddenError('Function available to admins only');
    }

    if (!user) return;

    return transformer.transform(await userRepository.addUser(user), true);
}

async function getUser(id, showProtected) {
    return transformer.transform(await userRepository.getUser(id), showProtected);
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
};
