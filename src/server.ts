import express from 'express'

import { Router, Request, Response } from 'express';
import { UserRouter } from './User';

import { config } from 'dotenv';
import { authMiddleware } from './Auth';
import { ItemsRouter } from './Items/ItemsRouter';
import Blocklist from './Auth/Blocklist';
const app = express();

export const blocklist = Blocklist.createBlocklist()

setTimeout(() => blocklist.removeLast(), (1000) * 60 * 60)


config()

app.use(express.json())

const router = express.Router()
app.use("/", UserRouter)

app.use("/auth/", authMiddleware, ItemsRouter)
app.listen(3333, () => 'server running on port 3333')