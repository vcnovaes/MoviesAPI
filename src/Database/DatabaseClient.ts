import { Database } from "sqlite3";
import { DatabaseInternalError, InvalidDatabaseURL } from "./Exceptions";

export class DatabaseClient extends Database {
    constructor(databaseURL?: string) {
        if (databaseURL === undefined) {
            databaseURL = process.env.DATABASE_URL
        }
        console.info(databaseURL)
        if (databaseURL === undefined) {
            throw new InvalidDatabaseURL(`Income URL: ${databaseURL}`)
        }
        try {
            super(databaseURL)
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
                resolve(data)
            }
        ))
    }

}