import faker from "faker";

import { Encrypter } from "@/data/protocols/cryptography/encrypter";
import { HashComparer } from "@/data/protocols/cryptography/hash-comparer";
import { Hasher } from "@/data/protocols/cryptography/hasher";

export class HashComparerSpy implements HashComparer {
  plaintext: string | undefined;
  digest: string | undefined;
  result = true;
  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;
    return this.result;
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: number | undefined;
  ciphertext = faker.datatype.uuid();
  async encrypt(plaintext: number): Promise<string> {
    this.plaintext = plaintext;
    return this.ciphertext;
  }
}

export class HasherSpy implements Hasher {
  plaintext?: string;
  digest?: string;
  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return this.digest!;
  }
}
