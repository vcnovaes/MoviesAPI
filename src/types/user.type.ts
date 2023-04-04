export interface User {
    username: string,
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    confirmedEmail: boolean,
    profileImage: Blob
}