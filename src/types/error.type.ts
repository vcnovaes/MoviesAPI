export interface HTTPError {
    code: number,
    message: string
}

export const isHTTPError = (error: any) => {
    return "code" in error
}