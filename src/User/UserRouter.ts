import { Router } from "express";
import { authMiddleware } from "../Auth";
import { UserController } from "./UserController";

export default Router()
    .post('/login', UserController.login)
    .post('/register', UserController.register)
    .post('/logout', UserController.logout)
    .put('/edit', authMiddleware, UserController.editUser)
    .post('/send-email', authMiddleware, UserController.sendEmailConfirmation)
    .post('/validate-email', authMiddleware, UserController.validateEmailConfirmationToken)


