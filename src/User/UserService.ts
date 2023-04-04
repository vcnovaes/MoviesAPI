import { comparePassword, hasher } from "../Auth/Auth";
import { Service } from "../Common/Service";
import { DatabaseClient } from "../Database/DatabaseClient";
import { DatabaseInternalError, ObjectNotFound } from "../Database/Exceptions";
import { User } from "../types";

export class UserService extends Service {

    primaryKey = "username"
    constructor() {
        super("user", new DatabaseClient)
    }
    public async getUser(username: string) {
        try {
            const user: User = await this.dbClient.getObject(this.mainTable, this.primaryKey, username)
            if (!user) {
                throw new ObjectNotFound(`Not possible to found username  ${username}`)
            }
            return user;
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            this.dbClient.close()
        }
    }

    public async login(username: string, password: string) {
        try {
            const user = await this.getUser(username)
            if (comparePassword(password, user.password)) {
                throw new ObjectNotFound("Username or password are incorrect")
            }
            return user
        } catch (error) {
            console.error("Error in login on UserService:", error)
            throw error
        }
    }

    public async register(user: User) {
        try {
            const query = `INSERT INTO user (username, email, first_name, last_name, profile_img, password) VALUES (?,?,?,?,?,?)`;
            return new Promise<boolean>((resolve, reject) => {
                this.dbClient.run(query, [user.username, user.email, user.firstName, user.lastName, user.profileImage, hasher(user.password)],
                    (error) => {
                        if (error !== null) {
                            console.error("Not possible to register user: ", user.username)
                            reject(false)
                            throw new DatabaseInternalError(` Not possible to register: ${error.message}`)
                        }
                        resolve(true)
                    }
                )
            })
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}


