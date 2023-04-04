import { Router } from "express";
import { UserController } from "./UserController";

export default Router()
    .post('/login', UserController.login)
    .post('/register', UserController.register)
    .post('/logout', UserController.logout)



