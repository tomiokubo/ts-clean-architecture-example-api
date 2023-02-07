import faker from "faker";

import {
  LoadAccountByUsernameRepository,
  LoadAccountByUsernameRepositoryResult,
} from "@/data/protocols/db/account/load-account-by-username-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-accessToken-repository";
import { CheckAccountByUsernameRepository } from "@/data/protocols/db/account/check-account-by-username-repository";
import {
  CreateAccountRepository,
  CreateAccountRepositoryParams,
} from "@/data/protocols/db/account/create-account-repository";

export class LoadAccountByUsernameRepositorySpy
  implements LoadAccountByUsernameRepository
{
  username: string | undefined;
  result: LoadAccountByUsernameRepositoryResult | null = {
    id: faker.datatype.number(),
    name: faker.name.findName(),
    passwordHash: faker.datatype.uuid(),
  };
  async loadByUsername(
    username: string
  ): Promise<LoadAccountByUsernameRepositoryResult | null> {
    this.username = username;
    return this.result || null;
  }
}

export class UpdateAccessTokenRepositoryMock
  implements UpdateAccessTokenRepository
{
  accessToken: string | undefined;
  id: number | undefined;
  async updateAccessToken(accessToken: string, id: number): Promise<void> {
    this.accessToken = accessToken;
    this.id = id;
  }
}

export class CheckAccountByUsernameRepositorySpy
  implements CheckAccountByUsernameRepository
{
  username?: string;
  result: boolean = false;
  async checkByUsername(username: string): Promise<boolean> {
    this.username = username;
    return this.result;
  }
}

export class CreateAccountRepositorySpy implements CreateAccountRepository {
  name?: string;
  username?: string;
  passwordHash?: string;
  result: boolean = true;
  async create(params: CreateAccountRepositoryParams): Promise<boolean> {
    this.name = params.name;
    this.username = params.username;
    this.passwordHash = params.passwordHash;
    return this.result;
  }
}
