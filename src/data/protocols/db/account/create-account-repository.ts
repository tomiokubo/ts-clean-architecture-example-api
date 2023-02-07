export type CreateAccountRepositoryParams = {
  name: string;
  username: string;
  passwordHash: string;
};

export interface CreateAccountRepository {
  create: (params: CreateAccountRepositoryParams) => Promise<boolean>;
}
