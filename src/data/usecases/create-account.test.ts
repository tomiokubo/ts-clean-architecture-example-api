import faker from "faker";
import { HasherSpy } from "../test/mock/cryptography-mock";
import {
  CheckAccountByUsernameRepositorySpy,
  CreateAccountRepositorySpy,
} from "../test/mock/db-account-mock";
import { DbCreateAccount } from "./create-account";

const makeSut = () => {
  const checkAccountByUsernameRepositorySpy =
    new CheckAccountByUsernameRepositorySpy();
  const hasherSpy = new HasherSpy();
  const createAccountRepositorySpy = new CreateAccountRepositorySpy();
  const sut = new DbCreateAccount(
    checkAccountByUsernameRepositorySpy,
    hasherSpy,
    createAccountRepositorySpy
  );
  return {
    sut,
    checkAccountByUsernameRepositorySpy,
    hasherSpy,
    createAccountRepositorySpy,
  };
};

const requestParams = {
  name: faker.name.findName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
};

describe("DbCreateAccount", () => {
  it("should call CheckAccountByUsernameRepository with correct value", async () => {
    const { sut, checkAccountByUsernameRepositorySpy } = makeSut();
    await sut.create(requestParams);
    expect(checkAccountByUsernameRepositorySpy.username).toBe(
      requestParams.username
    );
  });

  it("should throw if CheckAccountByUsernameRepository throws", async () => {
    const { sut, checkAccountByUsernameRepositorySpy } = makeSut();
    jest
      .spyOn(checkAccountByUsernameRepositorySpy, "checkByUsername")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.create(requestParams);
    await expect(promise).rejects.toThrowError();
  });

  it("should return false if CheckAccountByUsernameRepository return true", async () => {
    const { sut, checkAccountByUsernameRepositorySpy } = makeSut();
    checkAccountByUsernameRepositorySpy.result = true;
    const result = await sut.create(requestParams);
    expect(result).toBe(false);
  });

  it("should call Haser with correct value", async () => {
    const { sut, hasherSpy } = makeSut();
    await sut.create(requestParams);
    expect(hasherSpy.plaintext).toBe(requestParams.password);
  });

  it("should throw if Hasher throws", async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.create(requestParams);
    await expect(promise).rejects.toThrowError();
  });

  it("should call CreateAccountRepository with correct values", async () => {
    const { sut, createAccountRepositorySpy, hasherSpy } = makeSut();
    await sut.create(requestParams);
    expect(createAccountRepositorySpy.name).toBe(requestParams.name);
    expect(createAccountRepositorySpy.username).toBe(requestParams.username);
    expect(createAccountRepositorySpy.passwordHash).toBe(hasherSpy.digest);
  });

  it("should throw if CreateAccountRepository throws", async () => {
    const { sut, createAccountRepositorySpy } = makeSut();
    jest
      .spyOn(createAccountRepositorySpy, "create")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.create(requestParams);
    await expect(promise).rejects.toThrowError();
  });

  it("should return false if CreateAccountRepository returns false", async () => {
    const { sut, createAccountRepositorySpy } = makeSut();
    createAccountRepositorySpy.result = false;
    const result = await sut.create(requestParams);
    expect(result).toBe(false);
  });

  it("should return true if CreateAccountRepository returns true", async () => {
    const { sut, createAccountRepositorySpy } = makeSut();
    createAccountRepositorySpy.result = true;
    const result = await sut.create(requestParams);
    expect(result).toBe(true);
  });
});
