const userService = require('./../services/userService');

async function basicAuth(req, res, next) {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.statusCode = 401;

        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end();
        return;
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [userName, password] = credentials.split(':');
    const user = await userService.authenticate({ userName, password });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user;

    next();
}

module.exports = basicAuth;
