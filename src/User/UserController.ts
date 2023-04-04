import { Request, Response } from "express";
import { genarateToken, invalidateToken } from "../Auth/Auth";
import { HTTPError, User } from "../types";
import { UserService } from "./UserService";
export class UserController {

    public static async login(req: Request, res: Response) {
        const { username, password } = req.body
        console.info("Username:", username)
        console.info("Password:", password)
        try {
            const user = await (new UserService).login(username, password)

            console.info(user);
            if (user !== undefined) {
                const token = genarateToken(user)
                res.status(200).json(token)
                return
            }
            res.send(404).send({
                message: "User not found"
            })
        } catch (error) {
            const isHTTPError = "code" in (error as any)
            if (isHTTPError) {
                res.status((error as any).code).json(error)
                return
            }
            res.status(500).json(error)
        }
    }
    private static validateUserData(obj: any) {
        try {
            const user = (obj as User)
            return user
        } catch (error) {
            const httpError: HTTPError = {
                code: 400,
                message: "Invalid request"
            }
            throw error
        }
    }

    public static async register(req: Request, res: Response) {
        try {
            const newUser = UserController.validateUserData(req.body)
            const wasRegitered = await (new UserService()).register(newUser)
            if (wasRegitered) {
                res.status(201).send({
                    message: "New user created with success"
                })
                return
            }
            const error: HTTPError = {
                ...(new Error("Error when register user")),
                ...{ code: 501 }
            }
            throw error
        } catch (error) {
            if ("code" in (error as any)) {
                const httpError = (error as HTTPError)
                res.status(httpError.code).send({
                    messsage: httpError.message
                })
            } else {
                res.status(500).send({
                    message: (error as any).message
                })
            }
        }
    }
    public static async logout(req: Request, res: Response) {
        if (invalidateToken(req)) {
            res.status(200).send("Logout succeed")
        } else {
            res.send(400).send("Token not provided")
        }
    }
}