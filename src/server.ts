import express from 'express'

import { Router, Request, Response } from 'express';
import { UserRouter } from './User';

import { config } from 'dotenv';
import { authMiddleware } from './Auth';
import { MoviesRouter } from './Movies';
import Blocklist from './Auth/Blocklist';
import ActiveList from './Auth/Active';
import { PrivacyPolicyRouter } from './Misc';
import { sendEmailConfirmation } from './Misc/Email/EmailConfirmation';
import { EmailCache } from './Misc/Email/EmailCache';
const app = express();

export const blocklist = Blocklist.createBlocklist()
export const activeList = ActiveList.create()
export const emailCache = EmailCache.create()

setTimeout(() => {
    blocklist.removeLast()
    activeList.removeLast()
    emailCache.remove()
}, (1000) * 60 * 60)


config()

app.use(express.json())

const router = express.Router()
app.use("/", UserRouter)
app.use("/movies", authMiddleware, MoviesRouter)
app.use("/", PrivacyPolicyRouter)
app.get("/email", async (req, res) => {
    const { email } = req.body
    try {
        await sendEmailConfirmation(email)
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.listen(3033, () => 'server running on port 3033')