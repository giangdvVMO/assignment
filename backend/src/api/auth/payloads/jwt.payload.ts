export interface JwtPayload {
  sub?: number;
  username?: string;
  email?: string;
  scopes?: string[];
  isAdministrator?: boolean;
  name?: string;
}
