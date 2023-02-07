export type AuthenticationParams = {
  username: string;
  password: string;
};

export type AuthenticationResult = {
  name: string;
  accessToken: string;
};

export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<AuthenticationResult | null>;
}
