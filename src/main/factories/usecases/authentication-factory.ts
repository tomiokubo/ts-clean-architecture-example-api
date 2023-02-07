require("dotenv").config();
import { DbAuthentication } from "@/data/usecases/authentication";
import { Authentication } from "@/domain/usecases/authentication";
import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "@/infra/cryptography/jwt-adapter";
import { AccountRepository } from "@/infra/db/pg/repositories/account-repository";

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(process.env.TOKEN_SECRET!);
  const accountRepository = new AccountRepository();
  return new DbAuthentication(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  );
};
