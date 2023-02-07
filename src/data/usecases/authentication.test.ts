import {
  LoadAccountByUsernameRepositorySpy,
  UpdateAccessTokenRepositoryMock,
} from "../test/mock/db-account-mock";
import { DbAuthentication } from "./authentication";
import faker from "faker";
import { EncrypterSpy, HashComparerSpy } from "../test/mock/cryptography-mock";

const makeSut = () => {
  const loadAccountByUsernameRepositorySpy =
    new LoadAccountByUsernameRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypter = new EncrypterSpy();
  const updateAccessTokenRepositoryMock = new UpdateAccessTokenRepositoryMock();
  const sut = new DbAuthentication(
    loadAccountByUsernameRepositorySpy,
    hashComparerSpy,
    encrypter,
    updateAccessTokenRepositoryMock
  );
  return {
    sut,
    loadAccountByUsernameRepositorySpy,
    hashComparerSpy,
    encrypter,
    updateAccessTokenRepositoryMock,
  };
};
const requestParamsMock = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
};

describe("DbAuthentication", () => {
  it("should call LoadAccountByUsernameRepository with correct params", () => {
    const { sut, loadAccountByUsernameRepositorySpy } = makeSut();
    sut.auth(requestParamsMock);
    expect(loadAccountByUsernameRepositorySpy.username).toBe(
      requestParamsMock.username
    );
  });

  it("should throw if LoadAccountByUsernameRepository throws", async () => {
    const { sut, loadAccountByUsernameRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByUsernameRepositorySpy, "loadByUsername")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.auth(requestParamsMock);
    await expect(promise).rejects.toThrow();
  });

  it("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByUsernameRepositorySpy } = makeSut();
    loadAccountByUsernameRepositorySpy.result = null;
    const account = await sut.auth(requestParamsMock);
    expect(account).toBeNull();
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerSpy, loadAccountByUsernameRepositorySpy } =
      makeSut();
    await sut.auth(requestParamsMock);
    expect(hashComparerSpy.plaintext).toBe(requestParamsMock.password);
    expect(hashComparerSpy.digest).toBe(
      loadAccountByUsernameRepositorySpy.result?.passwordHash
    );
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, "compare").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(requestParamsMock);
    await expect(promise).rejects.toThrow();
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerSpy } = makeSut();
    hashComparerSpy.result = false;
    const account = await sut.auth(requestParamsMock);
    expect(account).toBeNull();
  });

  it("should call Encrypter with correct plaintext", async () => {
    const { sut, encrypter, loadAccountByUsernameRepositorySpy } = makeSut();
    await sut.auth(requestParamsMock);
    expect(encrypter.plaintext).toBe(
      loadAccountByUsernameRepositorySpy.result?.id
    );
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypter } = makeSut();
    jest.spyOn(encrypter, "encrypt").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(requestParamsMock);
    await expect(promise).rejects.toThrowError();
  });

  it("should return name and accessToken on success", async () => {
    const { sut, loadAccountByUsernameRepositorySpy, encrypter } = makeSut();
    const result = await sut.auth(requestParamsMock);
    expect(result?.name).toBe(loadAccountByUsernameRepositorySpy.result?.name);
    expect(result?.accessToken).toBe(encrypter.ciphertext);
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const {
      sut,
      updateAccessTokenRepositoryMock,
      encrypter,
      loadAccountByUsernameRepositorySpy,
    } = makeSut();
    await sut.auth(requestParamsMock);
    expect(updateAccessTokenRepositoryMock.accessToken).toBe(
      encrypter.ciphertext
    );
    expect(updateAccessTokenRepositoryMock.id).toBe(
      loadAccountByUsernameRepositorySpy.result?.id
    );
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryMock } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryMock, "updateAccessToken")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.auth(requestParamsMock);
    await expect(promise).rejects.toThrowError();
  });
});
