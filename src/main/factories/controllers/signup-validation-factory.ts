import { Validation } from "@/presentation/protocols/validation";
import {
  ValidationComposite,
  RequiredFieldValidation,
} from "@/validation/validators";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "username", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
