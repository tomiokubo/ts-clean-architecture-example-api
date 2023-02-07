import bcrypt from "bcrypt";
import { HashComparer } from "@/data/protocols/cryptography/hash-comparer";
import { Hasher } from "@/data/protocols/cryptography/hasher";

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}
  async compare(plaitext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaitext, digest);
  }
  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt);
  }
}
