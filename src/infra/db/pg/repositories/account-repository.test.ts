import faker, { fake } from "faker";
import { Account } from "../entities/account-entity";
import { AccountRepository } from "./account-repository";
import { DbHelper } from "../db-helper";

const makeSut = (): AccountRepository => {
  return new AccountRepository();
};

const createAccountParams = {
  name: faker.name.findName(),
  username: faker.internet.userName(),
  passwordHash: faker.datatype.uuid(),
};

describe("AccountRepository", () => {
  DbHelper.makeAppDataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    dropSchema: true,
    entities: [Account],
    subscribers: [],
    migrations: [],
  });

  const TestDataSource = DbHelper.getAppDataSource();

  beforeEach(async () => {
    await TestDataSource?.initialize()
      .then(() => console.log("Test db running"))
      .catch((e) => {
        console.log(e);
      });
  });

  afterEach(async () => {
    await TestDataSource?.destroy();
  });

  describe("create()", () => {
    it("should return true on success", async () => {
      const sut = makeSut();
      const result = await sut.create(createAccountParams);
      expect(result).toBe(true);
    });
  });

  describe("loadByEmail()", () => {
    it("should return an account on success", async () => {
      const sut = makeSut();
      await TestDataSource?.getRepository(Account).insert({
        ...createAccountParams,
        password_hash: createAccountParams.passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const account = await sut.loadByUsername(createAccountParams.username);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(createAccountParams.name);
      expect(account?.passwordHash).toBe(createAccountParams.passwordHash);
    });

    it("should return null if loadByEmail fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByUsername(faker.internet.userName());
      expect(account).toBeNull();
    });
  });

  describe("check()", () => {
    it("should return false if email is not in use", async () => {
      const sut = makeSut();
      await TestDataSource?.getRepository(Account).insert({
        ...createAccountParams,
        password_hash: createAccountParams.passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const isUsernameTaken = await sut.checkByUsername(
        faker.internet.userName()
      );
      expect(isUsernameTaken).toBe(false);
    });

    it("should return true if email existis", async () => {
      const sut = makeSut();
      await TestDataSource?.getRepository(Account).insert({
        ...createAccountParams,
        password_hash: createAccountParams.passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const isUsernameTaken = await sut.checkByUsername(
        createAccountParams.username
      );
      expect(isUsernameTaken).toBe(true);
    });

    describe("updateAccessToken()", () => {
      it("should update accounts accessToken on success", async () => {
        const sut = makeSut();

        await TestDataSource?.getRepository(Account).insert({
          ...createAccountParams,
          password_hash: createAccountParams.passwordHash,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const account = await TestDataSource?.getRepository(Account).findOneBy({
          username: createAccountParams.username,
        });

        expect(account?.access_token).toBeNull();

        const accessToken = faker.datatype.uuid();

        await sut.updateAccessToken(accessToken, account!.id!);

        const updatedAccount = await TestDataSource?.getRepository(
          Account
        ).findOneBy({
          username: createAccountParams.username,
        });

        expect(updatedAccount?.id).toBe(account?.id);
        expect(updatedAccount?.name).toBe(account?.name);
        expect(updatedAccount?.password_hash).toBe(account?.password_hash);
        expect(updatedAccount?.created_at).toBe(account?.created_at);
        expect(updatedAccount?.updated_at).toBe(account?.updated_at);
        expect(updatedAccount?.access_token).toBe(accessToken);
      });
    });
  });
});
