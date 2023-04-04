import { Service } from "../Common/Service";
import { DatabaseClient } from "../Database/DatabaseClient";
import { DatabaseInternalError } from "../Database/Exceptions";
import { Movie } from "../types/movies.type";

export class MoviesService extends Service {
    defaultPageSize = 10
    constructor() {
        super("movie", new DatabaseClient())
    }

    public getMovies(confirmedEmail: boolean = false, offset = 0, pageSize = 0, searchTerm = "") {
        if (pageSize == 0) pageSize = this.defaultPageSize
        if (searchTerm.length === 0)
            return new Promise<Movie[]>((resolve, reject) => {
                this.dbClient.all(`SELECT id, name, description, rating FROM movie WHERE secret=(?) OR secret=0 LIMIT (?) OFFSET (?)`,
                    [confirmedEmail, pageSize, offset],
                    (error, data) => {
                        if (error) {
                            reject(new DatabaseInternalError("Not possible to get data about movies"))
                        }
                        resolve((data as Movie[]))
                    }
                )
            })

        return new Promise<Movie[]>((resolve, reject) => {
            const query = `SELECT id, name, description, rating FROM movie WHERE (secret=(?)  OR secret=0)  AND (name LIKE "%${searchTerm}%"  OR  description LIKE "%${searchTerm}%") LIMIT (?) OFFSET (?)`
            this.dbClient.all(query,
                [confirmedEmail, pageSize, offset],
                (error, data) => {
                    if (error) {
                        reject(new DatabaseInternalError("Not possible to get data about movies"))
                    }
                    resolve((data as Movie[]))
                }
            )
        })
    }

    public getRestrictMovies(offset = 0, pageSize = 0, searchTerm = "") {

        if (pageSize == 0) pageSize = this.defaultPageSize
        if (searchTerm.length === 0)
            return new Promise<Movie[]>((resolve, reject) => {
                this.dbClient.all(`SELECT id, name, description, rating FROM movie WHERE secret=1 LIMIT (?) OFFSET (?)`,
                    [pageSize, offset],
                    (error, data) => {
                        if (error) {
                            reject(new DatabaseInternalError("Not possible to get data about movies"))
                        }
                        resolve((data as Movie[]))
                    }
                )
            })

        return new Promise<Movie[]>((resolve, reject) => {
            const query = `SELECT id, name, description, rating FROM movie WHERE secret=1 AND (name LIKE "%${searchTerm}%"  OR  description LIKE "%${searchTerm}%") LIMIT (?) OFFSET (?)`
            this.dbClient.all(query,
                [pageSize, offset],
                (error, data) => {
                    if (error) {
                        reject(new DatabaseInternalError("Not possible to get data about movies"))
                    }
                    resolve((data as Movie[]))
                }
            )
        })
    }
}