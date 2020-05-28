const userService = require('./../services/userService');
const routes = require('./../routes');

async function basicAuth(req, res, next) {
    // make swagger path public
    if (req.path.startsWith('/swagger')) {
        return next();
    }

    // allow all public routes to skip authentication
    const skipAuthentication = req.method === 'GET' && routes.publicRoutes.some((pr) => req.path.startsWith(pr));

    // check for basic auth header
    if (!skipAuthentication && (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1)) {
        res.statusCode = 401;

        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end();
        return;
    }

    // verify auth credentials
    let user;
    if (req.headers.authorization) {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [userName, password] = credentials.split(':');

        user = await userService.authenticate({ userName, password });
    }
    if (!skipAuthentication && !user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user;
    userService.setCurrentUser(user);

    next();
}

module.exports = basicAuth;
