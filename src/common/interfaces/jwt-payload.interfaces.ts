import { Company } from 'src/modules/companies/entities/company.entity';

export interface JwtPayload {
  id: number;
  name: string;
  company: Company;
  email: string;
  access_level: string;
  iat: number;
  ext: number;
}
