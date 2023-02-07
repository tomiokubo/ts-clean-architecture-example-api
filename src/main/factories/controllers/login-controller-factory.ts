import { Controller } from "@/presentation/protocols";
import { LoginController } from "@/presentation/controllers/login-controller";
import { makeDbAuthentication } from "../usecases/authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );
  return controller;
};
