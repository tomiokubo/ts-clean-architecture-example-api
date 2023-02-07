import faker from "faker";
import { UsernameInUseError } from "../errors";
import { forbidden, ok, serverError } from "../helpers";
import { AuthenticationSpy } from "../test/mocks/mock-account";
import { CreateAccountSpy } from "../test/mocks/mock-create-account";
import { ValidationSpy } from "../test/mocks/mock-validaton";
import { SignupController } from "./sign-up-controller";

const makeSut = () => {
  const validationSpy = new ValidationSpy();
  const createAccountSpy = new CreateAccountSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new SignupController(
    validationSpy,
    createAccountSpy,
    authenticationSpy
  );
  return { sut, validationSpy, createAccountSpy, authenticationSpy };
};

const requestParams = {
  name: faker.name.findName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
};

describe("SignupController", () => {
  it("should call Validator with correct values", async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(requestParams);
    expect(validationSpy.input).toEqual(requestParams);
  });

  it("should return 400 if Validation returns error", async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const result = await sut.handle(requestParams);
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(new Error());
  });

  it("should call CreateAccount with correct values", async () => {
    const { sut, createAccountSpy } = makeSut();
    await sut.handle(requestParams);
    expect(createAccountSpy.params).toEqual(requestParams);
  });

  it("should return 500 if CreateAccount throws", async () => {
    const { sut, createAccountSpy } = makeSut();
    jest.spyOn(createAccountSpy, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await sut.handle(requestParams);
    await expect(result).toEqual(serverError(new Error()));
  });

  it("should return 403 if CreateAccount returns false", async () => {
    const { sut, createAccountSpy } = makeSut();
    createAccountSpy.result = false;
    const result = await sut.handle(requestParams);
    expect(result).toEqual(forbidden(new UsernameInUseError()));
  });

  it("should return 200 on success", async () => {
    const { sut, createAccountSpy } = makeSut();
    const result = await sut.handle(requestParams);
    expect(result).toEqual(ok(createAccountSpy.result));
  });
});
