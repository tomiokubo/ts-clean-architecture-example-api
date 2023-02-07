import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hash";
  },

  async compare(): Promise<boolean> {
    return true;
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("BcryptAdepter", () => {
  describe("hash()", () => {
    it("should call hash with correct values", async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, "hash");
      await sut.hash("any_value");
      expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
    });

    it("should throw if hash throws", async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.hash("any_value");
      await expect(promise).rejects.toThrowError();
    });

    it("should return a hashcode on success", async () => {
      const sut = makeSut();
      const result = await sut.hash("any_value");
      expect(result).toBe("hash");
    });

    describe("compare()", () => {
      it("should call compare with correct values", async () => {
        const sut = makeSut();
        const compareSpy = jest.spyOn(bcrypt, "compare");
        await sut.compare("any_value", "other_value");
        expect(compareSpy).toHaveBeenCalledWith("any_value", "other_value");
      });

      it("should throw id compare throws", () => {
        const sut = makeSut();
        const compareSpy = jest
          .spyOn(bcrypt, "compare")
          .mockImplementationOnce(() => {
            throw new Error();
          });
        const promise = sut.compare("any_value", "other_value");
        expect(promise).rejects.toThrowError();
      });

      it("should return false if compare returns false", async () => {
        const sut = makeSut();
        const compareSpy = jest
          .spyOn(bcrypt, "compare")
          .mockImplementationOnce(() => {
            return false;
          });
        const result = await sut.compare("any", "other");
        expect(result).toBe(false);
      });

      it("should return true if compare returns true", async () => {
        const sut = makeSut();
        const result = await sut.compare("any", "other");
        expect(result).toBe(true);
      });
    });
  });
});
