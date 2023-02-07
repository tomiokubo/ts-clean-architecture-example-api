import { SignupController } from "@/presentation/controllers/sign-up-controller";

import { Controller } from "@/presentation/protocols";
import { makeDbAuthentication } from "../usecases/authentication-factory";
import { makeDbCreateAccount } from "../usecases/create-account-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const controller = new SignupController(
    makeSignUpValidation(),
    makeDbCreateAccount(),
    makeDbAuthentication()
  );
  return controller;
};
