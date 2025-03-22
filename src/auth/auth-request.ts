import { AuthUser, User } from '@supabase/supabase-js';
import { AccountRoles } from './role.enum';

export interface HackCCUser extends User {
  user_roles: AccountRoles[];
  sub: string;
}

export interface AuthRequest extends Request {
  user: HackCCUser;
}