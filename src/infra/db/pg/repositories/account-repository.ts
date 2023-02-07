import { DbHelper } from "../db-helper";
import { Account } from "../entities/account-entity";

import {
  LoadAccountByUsernameRepository,
  LoadAccountByUsernameRepositoryResult,
} from "@/data/protocols/db/account/load-account-by-username-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-accessToken-repository";
import {
  CreateAccountRepository,
  CreateAccountRepositoryParams,
} from "@/data/protocols/db/account/create-account-repository";
import { CheckAccountByUsernameRepository } from "@/data/protocols/db/account/check-account-by-username-repository";

export class AccountRepository
  implements
    CreateAccountRepository,
    LoadAccountByUsernameRepository,
    UpdateAccessTokenRepository,
    CheckAccountByUsernameRepository
{
  async checkByUsername(username: string): Promise<boolean> {
    const AppDataSource = DbHelper.getAppDataSource();
    const repository = await AppDataSource?.getRepository(Account);
    const account = await repository!.findOneBy({
      username,
    });
    return !!account;
  }

  async create(params: CreateAccountRepositoryParams): Promise<boolean> {
    const AppDataSource = DbHelper.getAppDataSource();
    const repository = await AppDataSource?.getRepository(Account);
    const newAccount = await repository?.insert({
      ...params,
      password_hash: params.passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return !!newAccount;
  }

  async loadByUsername(
    username: string
  ): Promise<LoadAccountByUsernameRepositoryResult | null> {
    const AppDataSource = DbHelper.getAppDataSource();
    const repository = await AppDataSource?.getRepository(Account);
    const account = await repository!.findOneBy({
      username,
    });
    if (!account) return null;
    return {
      id: account.id!,
      name: account.name!,
      passwordHash: account.password_hash!,
    };
  }

  async updateAccessToken(accessToken: string, id: number): Promise<void> {
    const AppDataSource = DbHelper.getAppDataSource();
    const repository = await AppDataSource?.getRepository(Account);
    await repository?.update({ id }, { access_token: accessToken });
  }
}
