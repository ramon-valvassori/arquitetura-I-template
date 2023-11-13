import { AccountDatabase } from "../database/AccountDatabase"
import { Account } from "../models/Account"
import { AccountDB } from "../types"

export class AccountBusiness {
  public getAccounts = async (input: any) => {
    const accountDatabase = new AccountDatabase()
    const accountsDB: AccountDB[] = await accountDatabase.findAccounts()

    const accounts = accountsDB.map((accountDB) => new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    ))

    return accounts
  }

  public getAccountBalance = async (input: any) => {
    const { id } = input

    const accountDatabase = new AccountDatabase()
    const accountDB = await accountDatabase.findAccountById(id)

    if (!accountDB) {
      // res.status(404)
      throw new Error("'id' não encontrado")
    }

    const account = new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    )

    const balance = account.getBalance()

    const output = {
      balance
    }

    return output
  }

  public createAccount = async (input: any) => {
    const { id, ownerId } = input

    if (typeof id !== "string") {
      // res.status(400)
      throw new Error("'id' deve ser string")
    }

    if (typeof ownerId !== "string") {
      // res.status(400)
      throw new Error("'ownerId' deve ser string")
    }

    const accountDatabase = new AccountDatabase()
    const accountDBExists = await accountDatabase.findAccountById(id)

    if (accountDBExists) {
      // res.status(400)
      throw new Error("'id' já existe")
    }

    const newAccount = new Account(
      id,
      0,
      ownerId,
      new Date().toISOString()
    )

    const newAccountDB: AccountDB = {
      id: newAccount.getId(),
      balance: newAccount.getBalance(),
      owner_id: newAccount.getOwnerId(),
      created_at: newAccount.getCreatedAt()
    }

    await accountDatabase.insertAccount(newAccountDB)

    return newAccount
  }

  public editAccountBalance = async (input: any) => {
    const { id, value } = input

    if (typeof value !== "number") {
      // res.status(400)
      throw new Error("'value' deve ser number")
    }

    const accountDatabase = new AccountDatabase()
    const accountDB = await accountDatabase.findAccountById(id)

    if (!accountDB) {
      // res.status(404)
      throw new Error("'id' não encontrado")
    }

    const account = new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    )

    const newBalance = account.getBalance() + value
    account.setBalance(newBalance)

    await accountDatabase.updateBalanceById(id, newBalance)

    return account
  }
}