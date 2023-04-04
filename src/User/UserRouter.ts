import { Router } from "express";
import { authMiddleware } from "../Auth";
import { UserController } from "./UserController";

export default Router()
    .post('/login', UserController.login)
    .post('/register', UserController.register)
    .post('/logout', UserController.logout)
    .put('/edit', authMiddleware, UserController.editUser)


