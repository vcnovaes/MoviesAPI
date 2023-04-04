import { hash, compareSync } from "bcrypt"
import { User } from "../types";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { blocklist } from "../server";

const SALT_ROUNDS = 8
const SECRET_KEY = "supersecret"
const EXPIRATION = '5 hours'

export async function hasher(rawPassword: string) {
    return await hash(rawPassword, SALT_ROUNDS)
}

export function comparePassword(rawPassword: string, hashedPassword: string) {
    return compareSync(rawPassword, hashedPassword)
}

export function genarateToken(user: User) {
    return {
        expiration: EXPIRATION,
        user: user.username,
        token: sign({ _id: user.username, email: user.email }, SECRET_KEY, {
            expiresIn: EXPIRATION,
        }),
        date: (new Date()).toISOString()
    }
}


export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token || blocklist.has(token)) {
            throw new Error();
        }

        const decoded = verify(token, SECRET_KEY);
        console.info(decoded);
        (req as CustomRequest).token = decoded
        next()
    } catch (error) {
        console.error(error)
        res.status(401).send('Authentication is required')
    }
}

export function invalidateToken(req: Request) {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token !== undefined) {
        blocklist.add(token)
        return true;
    }
    return false;
}