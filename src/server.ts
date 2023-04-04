import express from 'express'

import { Router, Request, Response } from 'express';
import { UserRouter } from './User';

import { config } from 'dotenv';
import { authMiddleware } from './Auth';
import { MoviesRouter } from './Movies';
import Blocklist from './Auth/Blocklist';
import ActiveList from './Auth/Active';
import { PrivacyPolicyRouter } from './Misc';
const app = express();

export const blocklist = Blocklist.createBlocklist()
export const activeList = ActiveList.create()

setTimeout(() => { blocklist.removeLast(); activeList.removeLast() }, (1000) * 60 * 60)


config()

app.use(express.json())

const router = express.Router()
app.use("/", UserRouter)
app.use("/movies", authMiddleware, MoviesRouter)
app.use("/", PrivacyPolicyRouter)
app.listen(3333, () => 'server running on port 3333')