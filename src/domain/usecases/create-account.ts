import { Account } from "../models/account-model";

export type CreateAccountParams = {
  name: string;
  username: string;
  password: string;
};

export interface CreateAccount {
  create: (params: CreateAccountParams) => Promise<boolean>;
}
