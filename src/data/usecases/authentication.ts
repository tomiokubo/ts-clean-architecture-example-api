import faker from "faker";
import {
  Authentication,
  AuthenticationParams,
  AuthenticationResult,
} from "@/domain/usecases/authentication";
import { LoadAccountByUsernameRepository } from "../protocols/db/account/load-account-by-username-repository";
import { HashComparer } from "../protocols/cryptography/hash-comparer";
import { Encrypter } from "../protocols/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "../protocols/db/account/update-accessToken-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByUsernameRepository: LoadAccountByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}
  async auth(
    params: AuthenticationParams
  ): Promise<AuthenticationResult | null> {
    const account = await this.loadAccountByUsernameRepository.loadByUsername(
      params.username
    );
    if (!account) {
      return null;
    }
    const isPasswordValid = await this.hashComparer.compare(
      params.password,
      account.passwordHash
    );
    if (!isPasswordValid) {
      return null;
    }

    const accessToken = await this.encrypter.encrypt(account.id);

    this.updateAccessTokenRepository.updateAccessToken(accessToken, account.id);
    return {
      name: account.name,
      accessToken,
    };
  }
}
