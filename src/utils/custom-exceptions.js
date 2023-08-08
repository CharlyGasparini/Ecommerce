
export class CartNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ProductNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UserNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class IncorrectCredentials extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UserAlreadyExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class IncompleteValues extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class SamePassword extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}