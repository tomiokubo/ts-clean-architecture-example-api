export interface CheckAccountByUsernameRepository {
  checkByUsername: (username: string) => Promise<boolean>;
}
