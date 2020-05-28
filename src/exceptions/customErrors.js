class DomainError extends Error {
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }
}

class NotFoundError extends DomainError {
    constructor(message) {
        super(message, 404);
    }
}

class ForbiddenError extends DomainError {
    constructor(message) {
        super(message, 403);
    }
}

module.exports = { NotFoundError, DomainError, ForbiddenError };
