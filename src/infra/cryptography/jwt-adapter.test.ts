import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(payload: object, secret: string): Promise<string> {
    return "random_token";
  },
}));

const makeSut = () => {
  const sut = new JwtAdapter("secret");
  return sut;
};

describe("JwtAdapter", () => {
  describe("encrypt()", () => {
    it("should call jwt.sign with correct values", async () => {
      const sut = makeSut();
      const jwtAdapterSpy = jest.spyOn(jwt, "sign");
      await sut.encrypt(123);
      expect(jwtAdapterSpy).toHaveBeenCalledWith("123", "secret");
    });

    it("should throw if jwt.sign throws", async () => {
      const sut = makeSut();
      const jwtAdapterSpy = jest
        .spyOn(jwt, "sign")
        .mockImplementationOnce(() => {
          throw new Error();
        });
      const promise = sut.encrypt(123);
      expect(promise).rejects.toThrowError();
    });

    it("should return a token on success", async () => {
      const sut = makeSut();
      const result = await sut.encrypt(123);
      expect(result).toBe("random_token");
    });
  });
});
