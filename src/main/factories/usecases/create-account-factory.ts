import { DbCreateAccount } from "@/data/usecases/create-account";
import { CreateAccount } from "@/domain/usecases/create-account";
import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter";
import { AccountRepository } from "@/infra/db/pg/repositories/account-repository";

export const makeDbCreateAccount = (): CreateAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountRepository();

  return new DbCreateAccount(
    accountRepository,
    bcryptAdapter,
    accountRepository
  );
};
