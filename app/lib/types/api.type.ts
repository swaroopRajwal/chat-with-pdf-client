export interface IResponse<T = Record<string, any>> {
    status: boolean,
    data: T
}

export interface IResponseMultiple<T = Record<string, any>> {
    status: boolean,
    data: T[],
    page: number,
    limit: number,
    count: number,
}