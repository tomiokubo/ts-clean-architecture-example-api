import {
  CreateAccount,
  CreateAccountParams,
} from "@/domain/usecases/create-account";
import { Hasher } from "../protocols/cryptography/hasher";
import { CheckAccountByUsernameRepository } from "../protocols/db/account/check-account-by-username-repository";
import { CreateAccountRepository } from "../protocols/db/account/create-account-repository";

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly checkAccountByUsernameRepository: CheckAccountByUsernameRepository,
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository
  ) {}
  async create(params: CreateAccountParams): Promise<boolean> {
    const isUsernameTaken =
      await this.checkAccountByUsernameRepository.checkByUsername(
        params.username
      );
    if (isUsernameTaken) return false;
    const passwordHash = await this.hasher.hash(params.password);
    const result = await this.createAccountRepository.create({
      name: params.name,
      username: params.username,
      passwordHash,
    });
    return result;
  }
}
