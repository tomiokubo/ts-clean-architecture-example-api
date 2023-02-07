export type LoadAccountByUsernameRepositoryResult = {
  id: number;
  name: string;
  passwordHash: string;
};

export interface LoadAccountByUsernameRepository {
  loadByUsername: (
    username: string
  ) => Promise<LoadAccountByUsernameRepositoryResult | null>;
}
