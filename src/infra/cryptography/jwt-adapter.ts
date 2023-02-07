import jwt from "jsonwebtoken";
import { Encrypter } from "@/data/protocols/cryptography/encrypter";

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}
  async encrypt(plaintext: number): Promise<string> {
    const stringId = plaintext.toString();
    return jwt.sign(stringId, this.secret);
  }
}
