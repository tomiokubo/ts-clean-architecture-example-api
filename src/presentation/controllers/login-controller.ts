import { Authentication } from "@/domain/usecases/authentication";
import { badRequest, serverError, unauthorized } from "../helpers";
import { Controller, HttpResponse } from "../protocols";
import { Validation } from "../protocols/validation";

export type LoginControllerResquestParams = {
  username: string;
  password: string;
};

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}
  async handle(request: LoginControllerResquestParams): Promise<HttpResponse> {
    const error = this.validation.validate(request);
    if (error) return badRequest(error);
    try {
      const authenticationModel = await this.authentication.auth(request);
      if (!authenticationModel) return unauthorized();
      return {
        statusCode: 200,
        body: authenticationModel,
      };
    } catch (error) {
      return serverError(error);
    }
  }
}
