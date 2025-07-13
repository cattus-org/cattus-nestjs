export interface JwtPayload {
  id: number;
  name: string;
  company: number;
  email: string;
  access_level: string;
  iat: number;
  ext: number;
}
