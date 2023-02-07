import faker from "faker";
import { AuthenticationSpy } from "../test/mocks/mock-account";
import { LoginController } from "./login-controller";
import { badRequest, ok, serverError, unauthorized } from "../helpers";
import { ValidationSpy } from "../test/mocks/mock-validaton";

const makeSut = () => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return { sut, authenticationSpy, validationSpy };
};

const requestParams = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
};
describe("LoginController", () => {
  it("should call Authentication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();
    await sut.handle(requestParams);
    expect(authenticationSpy.params).toBe(requestParams);
  });

  it("should return 401 if invalid credetions are provided", async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.result = null;
    const result = await sut.handle(requestParams);
    expect(result).toEqual(unauthorized());
  });

  it("should return 500 if authentication throws", async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, "auth").mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await sut.handle(requestParams);
    expect(result).toEqual(serverError(new Error()));
  });

  it("should should return 200 if valid credentials are provided", async () => {
    const { sut, authenticationSpy } = makeSut();
    const authResult = {
      name: faker.name.findName(),
      accessToken: faker.datatype.uuid(),
    };
    authenticationSpy.result = authResult;
    const result = await sut.handle(requestParams);
    expect(result).toEqual(ok(authResult));
  });

  it("should call Validation with correct values", async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(requestParams);
    expect(validationSpy.input).toEqual(requestParams);
  });

  it("should return 400 if Validation returns an error", async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const result = await sut.handle(requestParams);
    expect(result).toEqual(badRequest(new Error()));
  });
});
