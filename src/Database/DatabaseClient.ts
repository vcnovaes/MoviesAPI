import { Database } from "sqlite3";
import { User } from "../types";
import { DatabaseInternalError, InvalidDatabaseURL } from "./Exceptions";

export class DatabaseClient extends Database {
    constructor(databaseURL?: string) {
        if (databaseURL === undefined) {
            databaseURL = process.env.DATABASE_URL
        }
        console.info(databaseURL)
        if (databaseURL === undefined) {
            console.error(new InvalidDatabaseURL(`Income URL: ${databaseURL}`))
        }
        try {
            super(databaseURL ?? "")
        } catch (error) {
            if (error instanceof Error)
                throw new DatabaseInternalError(error.message)
            console.error(error)
            throw new DatabaseInternalError("Generic Error")
        }
    }


    public getObject(table: string, conditionField: string, conditionValue: string) {
        const query = `SELECT * FROM ${table} WHERE ${conditionField} = ${conditionValue}`
        console.info(query)
        return new Promise<any>((resolve, reject) => this.get(`SELECT * FROM ${table} WHERE ${conditionField} = (?)`, [conditionValue],
            (error, data) => {
                if (error) {
                    reject(error)
                }
                if (!data) { resolve(data); return }
                const user: User = {
                    username: (data as any).username,
                    email: (data as any).email,
                    password: (data as any).password,
                    firstName: (data as any).first_name,
                    lastName: (data as any).last_name,
                    confirmedEmail: ((data as any).confirmed_email == 1),
                    profileImage: (data as any).profile_img
                }
                resolve(user)
            }
        ))
    }

}