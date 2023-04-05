import { Request, Response } from "express";
import { genarateToken, getUsernameByToken, hasher, invalidateToken } from "../Auth/Auth";
import { sendEmailConfirmation, validateIncomeConfirmationToken } from "../Misc/Email/EmailConfirmation";
import { HTTPError, User } from "../types";
import { UserService } from "./UserService";
export class UserController {

    public static async login(req: Request, res: Response) {
        const { username, password } = req.body
        console.info("Username:", username)
        console.info("Password:", password)
        try {
            const user = await (new UserService).login(username, password)

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
            console.info(error)
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

    public static async editUser(req: Request, res: Response) {
        try {
            let user = UserController.validateUserData(req.body)
            if (getUsernameByToken(req) !== user.username) {
                res.status(401).send("You can not edit this user")
                return;
            }
            user.password = await hasher(user.password)
            const success = await (new UserService()).setUser(user)
            console.info(success)
            if (success) {
                res.status(200).send("User data was updated")
                return
            }
            throw Error("Something wrong happened")
        } catch (err) {
            let code = (err as any).code
            if (code === undefined) code = 500
            res.status(code).send(err)
        }

    }

    public static async sendEmailConfirmation(req: Request, res: Response) {
        try {
            const username = getUsernameByToken(req)
            if (!username) {
                res.status(401).send("There's something wrong with your token")
                return
            }
            const user = await (new UserService()).getUser(username)
            if (user.confirmedEmail) {
                res.status(400).send("This email is already validated")
                return;
            }
            await sendEmailConfirmation(user.email)
            res.status(200).send(`Email send it to ${user.email}`)
        } catch (err) {
            res.status((err as any).code ?? 500).send((err as any).message)
            return
        }
    }

    public static async validateEmailConfirmationToken(req: Request, res: Response) {
        try {
            const username = getUsernameByToken(req)
            if (!username) {
                res.status(401).send("Something's wrong with your token")
                return
            }
            let user = await (new UserService()).getUser(username)
            const { emailToken } = req.body
            if (!emailToken) {
                res.send(400).send("emailToken field was not send it")
            }
            const valid = validateIncomeConfirmationToken(user.email, (emailToken as string))
            if (valid) {
                user.confirmedEmail = true
                const updated = await (new UserService()).confirmEmail(user)
                if (updated) {
                    res.status(200).send("Email confirmed with success")
                    return
                } else {
                    res.status(500).send("Something went wrong")
                    return;
                }
            } else {
                res.status(400).send("Invalid token")
                return
            }
        } catch (err) {
            res.status((err as any).code ?? 500).send(err)
            return
        }
    }
}