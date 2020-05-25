const transformList = (users) => {
    if (!users) return [];

    if (!Array.isArray(users)) {
        throw new Error('Please provide a user array');
    }

    const list = [];
    users.forEach((user) => {
        list.push({
            userName: user.userName,
            email: user.email,
        });
    });

    return list;
};

module.exports = { transformList };
