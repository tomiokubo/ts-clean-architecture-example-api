import { Authentication } from "@/domain/usecases/authentication";
import { CreateAccount } from "@/domain/usecases/create-account";
import { UsernameInUseError } from "../errors";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { Controller, HttpResponse } from "../protocols";
import { Validation } from "../protocols/validation";

type SignupControllerRequestParams = {
  name: string;
  username: string;
  password: string;
};

export class SignupController implements Controller {
  constructor(
    private readonly validator: Validation,
    private readonly createAccount: CreateAccount,
    private readonly authentication: Authentication
  ) {}
  async handle(request: SignupControllerRequestParams): Promise<HttpResponse> {
    const error = await this.validator.validate(request);
    if (error) return badRequest(error);
    try {
      const isValid = await this.createAccount.create(request);
      if (!isValid) return forbidden(new UsernameInUseError());
      await this.authentication.auth({
        username: request.username,
        password: request.password,
      });
      return ok(isValid);
    } catch (error) {
      return serverError(error);
    }
  }
}
