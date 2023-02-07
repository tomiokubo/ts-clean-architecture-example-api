export interface UpdateAccessTokenRepository {
  updateAccessToken: (accessToken: string, id: number) => Promise<void>;
}
