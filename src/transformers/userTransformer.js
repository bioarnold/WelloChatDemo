function transform(user, showProtected) {
    if (!user) return user;

    if (Array.isArray(user)) {
        throw new Error('Please call transformList for arrays');
    }

    const result = {
        userName: user.userName,
        profileImage: user.profileImage,
    };

    return { ...result, ...(showProtected ? { email: user.email } : {}) };
}

function transformList(users, showProtected) {
    if (!users) return [];

    if (!Array.isArray(users)) {
        throw new Error('Please provide a user array');
    }

    const list = [];
    users.forEach((user) => {
        list.push(transform(user, showProtected));
    });

    return list;
}

module.exports = { transform, transformList };
