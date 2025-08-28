import { ForbiddenException } from '@nestjs/common';
import { AdminAccess } from '../constants/user.constants';

export function hasRoleOrSelf(
  currentUser: { id: number; access_level: string },
  targetUserId: number,
  roles: string[] = AdminAccess,
) {
  const isSelf = currentUser.id === targetUserId;
  const hasRole = roles.includes(currentUser.access_level);

  if (!isSelf && !hasRole) {
    throw new ForbiddenException('access denied');
  }
}
