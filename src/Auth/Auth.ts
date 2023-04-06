import { hash, compareSync } from "bcrypt"
import { User } from "../types";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { activeList, blocklist } from "../server";

const SALT_ROUNDS = 8
const SECRET_KEY = "supersecret"
const EXPIRATION = '1 hour'

export async function hasher(rawPassword: string) {
    return await hash(rawPassword, SALT_ROUNDS)
}

export function comparePassword(rawPassword: string, hashedPassword: string) {
    return compareSync(rawPassword, hashedPassword)
}

export function generateToken(user: User) {

    const token = sign({ _id: user.username, email: user.email }, SECRET_KEY, {
        expiresIn: EXPIRATION
    })
    activeList.add(token, user.username)
    return {
        expiration: EXPIRATION,
        user: user.username,
        token: token,
        date: (new Date()).toISOString()
    }
}


export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export async function extraInfo(req: Request) {
    const token = req.header('Authorization')?.replace('Bearer ', '')

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
        activeList.remove(token)
        return true;
    }
    return false;
}

export function getUsernameByToken(req: Request) {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token)
        return activeList.getUsername(token)
}