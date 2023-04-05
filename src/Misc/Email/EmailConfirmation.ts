import { emailCache } from "../../server";
import EmailService from "./EmailService"

function createConfirmationToken() {
    return String(getRandomInt(1000, 9999))
}

export async function sendEmailConfirmation(email: string) {

    const confirmationToken = createConfirmationToken()
    const defaultSubject = "Email confirmation"
    const defaultMessage = `Confirmation Token: ${confirmationToken}`;

    return new Promise<void>((resolve, reject) => {
        try {

            (new EmailService(email, defaultSubject, defaultMessage)).sendMail()
            emailCache.add(email, confirmationToken)
            resolve()
        }
        catch (error) {
            reject()
        }
    })
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

export function validateIncomeConfirmationToken(email: string, incomeToken: string) {
    return emailCache.compare(email, incomeToken)
}