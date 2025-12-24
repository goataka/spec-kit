export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
