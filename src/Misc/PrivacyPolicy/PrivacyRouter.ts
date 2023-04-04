import { Router, Request, Response } from "express";

export const PrivacyPolicyRouter = Router().get("/privacy-policy",
    (req: Request, res: Response) => {
        const path = process.env.PRIVACY_POLICY_PATH
        if (path) {
            res.download(path)
            return
        }
        res.status(404).send("Not found")
    })