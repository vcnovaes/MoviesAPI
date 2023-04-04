import { Request, Response } from "express";
import { getUsernameByToken } from "../Auth/Auth";
import { UserService } from "../User/UserService";
import { MoviesService } from "./MoviesService";
export class MoviesController {
    public static async getMovies(req: Request, res: Response) {
        try {
            const username = getUsernameByToken(req)
            if (username === undefined) {
                res.status(401).send("You token is not valid")
                return
            }
            const canSeeSecrets = await MoviesController.canSeeSecretMovies(username)
            const movies = await new MoviesService().getMovies(
                canSeeSecrets,
                ((req.query.page as any) ?? 0),
                (req.query.page_size as any) ?? 10,
                (req.query.search as any) ?? ""
            )
            res.status(200).send(movies)
        } catch (error) {
            console.error(error)

            res.status(500).send("Not possible to get movies")
        }
    }
    private static async canSeeSecretMovies(username: string) {
        const user = await (new UserService()).getUser(username)
        return user.confirmedEmail == true;
    }

}