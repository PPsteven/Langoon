export interface Resp<T> {
    code: number,
    message: string,
    data: T
}

export type PResp<T> = Promise<Resp<T>>