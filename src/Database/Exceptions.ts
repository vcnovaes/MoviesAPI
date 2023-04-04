import { HTTPError } from "../types/error.type"

export class InvalidDatabaseURL extends Error {
    code: number
    constructor(message: string) {
        super(message)
        this.name = "InvalidDatabaseURL"
        this.code = 500
    }
}

export class DatabaseInternalError extends Error implements HTTPError {
    code: number
    constructor(message: string) {
        super(message)
        this.code = 500
    }
}

export class ObjectNotFound extends Error implements HTTPError {
    code: number
    constructor(message: string) {
        super(message)
        this.code = 400
    }
}