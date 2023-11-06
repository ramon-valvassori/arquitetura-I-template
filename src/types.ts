export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    created_at: string
}

export interface AccountDB {
    id: string,
    balance: number,
    owner_id: string,
    created_at: string
}
