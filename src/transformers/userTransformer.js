function transform(user) {
    if (!user) return user;

    if (Array.isArray(user)) {
        throw new Error('Please call transformList for arrays');
    }

    return {
        userName: user.userName,
        email: user.email,
    };
}

function transformList(users) {
    if (!users) return [];

    if (!Array.isArray(users)) {
        throw new Error('Please provide a user array');
    }

    const list = [];
    users.forEach((user) => {
        list.push(transform(user));
    });

    return list;
}

module.exports = { transform, transformList };
