import faker from "faker";

import {
  Authentication,
  AuthenticationParams,
  AuthenticationResult,
} from "@/domain/usecases/authentication";

export class AuthenticationSpy implements Authentication {
  params?: AuthenticationParams;
  result: AuthenticationResult | null = {
    name: faker.name.findName(),
    accessToken: faker.datatype.uuid(),
  };
  async auth(
    params: AuthenticationParams
  ): Promise<AuthenticationResult | null> {
    this.params = params;
    return this.result;
  }
}
